
CREATE DATABASE IF NOT EXISTS saep_db;
USE saep_db;
CREATE TABLE IF NOT EXISTS saep_produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    quantidade INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 5
);
CREATE TABLE IF NOT EXISTS saep_movimentacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    quantidade INT NOT NULL,
    data_movimentacao DATE NOT NULL
    FOREIGN KEY (produto_id) REFERENCES saep_produto(id),
    FOREIGN KEY (usuario_id) REFERENCES auth_user(id)
);
INSERT INTO saep_produto (nome, descricao, quantidade, estoque_minimo) VALUES
('Martelo Aço', 'Martelo com cabo de madeira', 20, 5),
('Chave de Fenda Phillips', 'Ponta imantada', 15, 3),
('Alicate Universal', 'Metal reforçado', 10, 4);
INSERT INTO saep_movimentacao (produto_id, usuario_id, tipo, quantidade, data_movimentacao) VALUES
(1, 1, 'entrada', 25, '2024-01-15'),
(1, 1, 'saida', 5, '2024-01-20'),
(2, 1, 'entrada', 10, '2024-01-10');