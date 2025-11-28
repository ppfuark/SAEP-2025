from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register('produtos', views.ProdutoViewSet)
router.register('movimentacoes', views.MovimentacaoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('estoque-baixo/', views.estoque_baixo),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]