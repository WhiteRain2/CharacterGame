from django.http import JsonResponse
from game.models.player.player import Player


def modify(request):
    user = request.user
    data = request.GET
    score = data.get('score')
    user = Player.objects.get(user=user)
    if not user:
        return JsonResponse({
            'result': "error"
        })
    else:
        user.set_score(score)
        user.save()
        return JsonResponse({
            'result': "score succeed"
        })
