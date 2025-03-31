from django.shortcuts import render

def home(request):
    return render(request, 'game/home.html')

def knee_knockdown(request):
    return render(request, 'game/knee_knockdown.html')

def fever_frenzy(request):
    return render(request, 'game/fever_frenzy.html')

def burn_emergency(request):
    return render(request, 'game/burn_emergency.html')

def knee_drag_game(request):
    return render(request, 'game/knee_drag_game.html')
