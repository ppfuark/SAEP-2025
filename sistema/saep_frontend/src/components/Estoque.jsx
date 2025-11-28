// src/components/Estoque.js
import React, { useState, useEffect } from 'react';
import { produtosAPI, movimentacoesAPI, estoqueAPI } from '../services/api';

function Estoque({ navigateTo }) {
  const [produtos, setProdutos] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [showMovForm, setShowMovForm] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [movFormData, setMovFormData] = useState({
    tipo: 'entrada',
    quantidade: 1,
    data_movimentacao: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodRes, movRes, alertRes] = await Promise.all([
        produtosAPI.getAll(),
        movimentacoesAPI.getAll(),
        estoqueAPI.getBaixo()
      ]);
      setProdutos(prodRes.data);
      setMovimentacoes(movRes.data);
      setAlertas(alertRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleMovSubmit = async (e) => {
    e.preventDefault();
    try {
      await movimentacoesAPI.create({
        ...movFormData,
        produto: selectedProduto.id,
        quantidade: parseInt(movFormData.quantidade)
      });
      
      setShowMovForm(false);
      setSelectedProduto(null);
      setMovFormData({
        tipo: 'entrada',
        quantidade: 1,
        data_movimentacao: new Date().toISOString().split('T')[0]
      });
      
      loadData();
      
      if (movFormData.tipo === 'saida') {
        const novoEstoque = selectedProduto.quantidade - movFormData.quantidade;
        if (novoEstoque < selectedProduto.estoque_minimo) {
          alert(`ALERTA: ${selectedProduto.nome} está abaixo do estoque mínimo!`);
        }
      }
    } catch (error) {
      alert('Erro ao registrar movimentação');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Estoque</h1>
            <button
              onClick={() => navigateTo('dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Voltar
            </button>
          </div>
        </div>
      </header>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Alertas de Estoque Baixo
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  {alertas.map(produto => (
                    <p key={produto.id} className="mt-1">
                      {produto.nome}: {produto.quantidade} unidades (mínimo: {produto.estoque_minimo})
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Produtos */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Produtos</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Clique para movimentar estoque</p>
              </div>
              <div className="border-t border-gray-200">
                <div className="max-h-96 overflow-y-auto">
                  {produtos.map(produto => (
                    <div
                      key={produto.id}
                      onClick={() => {
                        setSelectedProduto(produto);
                        setShowMovForm(true);
                      }}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        produto.quantidade < produto.estoque_minimo ? 'bg-red-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{produto.nome}</h4>
                          <p className="text-sm text-gray-500">Estoque: {produto.quantidade}</p>
                          <p className="text-sm text-gray-500">Mínimo: {produto.estoque_minimo}</p>
                        </div>
                        {produto.quantidade < produto.estoque_minimo && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ALERTA
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Movimentações */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Movimentações</h3>
              </div>
              <div className="border-t border-gray-200">
                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {movimentacoes.map(mov => (
                        <tr key={mov.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(mov.data_movimentacao).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {mov.produto_nome}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              mov.tipo === 'entrada' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {mov.tipo === 'entrada' ? '📥 Entrada' : '📤 Saída'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {mov.quantidade}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Movimentação */}
      {showMovForm && selectedProduto && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Movimentação - {selectedProduto.nome}
              </h3>
              <form onSubmit={handleMovSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    value={movFormData.tipo}
                    onChange={(e) => setMovFormData({...movFormData, tipo: e.target.value})}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                  <input
                    type="number"
                    value={movFormData.quantidade}
                    onChange={(e) => setMovFormData({...movFormData, quantidade: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Data</label>
                  <input
                    type="date"
                    value={movFormData.data_movimentacao}
                    onChange={(e) => setMovFormData({...movFormData, data_movimentacao: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Registrar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMovForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Estoque;