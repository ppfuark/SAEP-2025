# saep/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.db.models import F
from .models import Produto, Movimentacao
from .serializers import *

class ProdutoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

    def get_queryset(self):
        queryset = Produto.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(nome__icontains=search)
        return queryset

class MovimentacaoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Movimentacao.objects.all()
    serializer_class = MovimentacaoSerializer

    def perform_create(self, serializer):
        movimentacao = serializer.save(usuario=self.request.user)
        
        # Atualizar estoque
        produto = movimentacao.produto
        if movimentacao.tipo == 'entrada':
            produto.quantidade += movimentacao.quantidade
        else:
            produto.quantidade -= movimentacao.quantidade
        produto.save()

@api_view(['GET'])
def estoque_baixo(request):
    """Retorna produtos com estoque abaixo do mínimo"""
    produtos = Produto.objects.filter(quantidade__lt=F('estoque_minimo'))
    serializer = ProdutoSerializer(produtos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def user_info(request):
    """Retorna informações do usuário logado"""
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
    })