import json

import stripe
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

stripe.api_key = settings.STRIPE_TEST_SECRET_KEY
stripe.log = 'info'


class PledgeView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(PledgeView, self).dispatch(request, *args, **kwargs)

    def get(self, request):
        # charity = request.GET.get('charity')
        return render(request, 'index.html')

    def post(self, request):
        body = json.loads(request.body.decode('utf-8'))

        try:
            print(body)
            charge = stripe.Charge.create(
                amount=body['amount'] * 100,
                currency='AUD',
                source=body['stripe_token']['token']['id'],
                description='hi',
                statement_descriptor="22 Characters max",
                metadata={'order_id': 12345}
            )
            print(charge.__dict__)
            if charge['status'] == 'succeeded':
                return HttpResponse(json.dumps(
                    {'message': 'Your transaction has been successful.'})
                )
            else:
                raise stripe.error.CardError

        except stripe.error.CardError as e:
            body = e.json_body
            err = body.get('error', {})
            return HttpResponse(
                json.dumps({"message": err.get('message')}),
                status=e.http_status
            )
        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            return HttpResponse(json.dumps({
                'message': "The API was not able to respond, try again."
            }))
        except stripe.error.InvalidRequestError as e:
            # invalid parameters were supplied to Stripe's API
            return HttpResponse(json.dumps({
                'message': "Invalid parameters, unable to process payment."
            }))
        # Something else happened, completely unrelated to Stripe
        except Exception as e:
            print(e, 1)
            return HttpResponse(json.dumps({
                'message': 'Unable to process payment, try again.'
            }))
