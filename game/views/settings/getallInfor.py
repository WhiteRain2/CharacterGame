from django.http import JsonResponse
from game.models.player.player import Player


def getallInfo(request):
    players = {}
    data = Player.objects.all()
    for player in data:
        players[player.user.username] = player.score
    return JsonResponse({
        'result': players
    })
