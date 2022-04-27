from django.urls import path, include
from game.views.index import index

urlpatterns = [
    path("settings/", include("game.urls.settings.index")),
    path("", index, name="index"),
]
