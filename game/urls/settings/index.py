from django.urls import path, include
from game.views.settings.getinfo import getinfo
from game.views.settings.login import signin
from game.views.settings.logout import signout
from game.views.settings.register import register
from game.views.settings.modify import modify
from game.views.settings.getallInfor import getallInfo


urlpatterns = [
    path("getinfo/", getinfo, name="settings_getinfo"),
    path("login/", signin, name="settings_login"),
    path("logout/", signout, name="settings_logout"),
    path("register/", register, name="settings_register"),
    path("modify/", modify, name="settings_modify"),
    path("getallInfo/", getallInfo, name="settings_getallInfo"),
]
