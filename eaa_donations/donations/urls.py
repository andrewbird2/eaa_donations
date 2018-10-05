from django.conf.urls import url, include

from .api import router
from .views import PledgeView

app_name = "donations"
urlpatterns = [
    url(r'^pledge/', PledgeView.as_view(), name='pledge'),
    url(r'^', include(router.urls)),
]
