import json

import stripe
from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from .forms import PledgeForm, PledgeComponentFormSet
from .models import PaymentMethod

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
        print(body)
        pledge_form = PledgeForm(body)
        pledge_form.save()
        component_formset = PledgeComponentFormSet(body)

        if not (pledge_form.is_valid() and component_formset.is_valid()):
            print([pledge_form.errors] + component_formset.errors)
            return JsonResponse({
                'error_message': [pledge_form.errors] + component_formset.errors
            }, status=400)
        with transaction.atomic():
            pledge = pledge_form.save()
            print(pledge)
            for component in component_formset.forms:
                component.instance.pledge = pledge
            component_formset.save()

        if pledge.payment_method is PaymentMethod.BANK:
            pledge.generate_reference()
            return JsonResponse({'bankReference': pledge.reference,
                                 'success': True,
                                 })

        try:
            stripe.Subscription.create()
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
                return JsonResponse(
                    {'success': True}
                )
            else:
                raise stripe.error.CardError

        except stripe.error.CardError as e:
            body = e.json_body
            err = body.get('error', {})
            return JsonResponse(
                {'success': False,
                 'errorMessage': err.get('message')}
            )

        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            return JsonResponse(
                {'success': False,
                 'errorMessage': 'Too many requests!'}
            )
        except stripe.error.InvalidRequestError as e:
            # invalid parameters were supplied to Stripe's API
            return JsonResponse(
                {'success': False,
                 'errorMessage': 'Encountered a problem.'}
            )
        # Something else happened, completely unrelated to Stripe
        except Exception as e:
            print(e, 1)
            return JsonResponse(
                {'success': False,
                 'errorMessage': 'Encountered a problem.'}
            )
