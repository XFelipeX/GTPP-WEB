<h1 align="center"> <strong>GTPP - Gerenciador de Tarefas<h1></strong>

<h3>Desenvolvido por:</h3>
<p>><strong>FrontEnd</strong> Felipe</p>
<p>><strong>BackEnd</strong><a href="https://github.com/kyotsuyoi"> Kyo</href></p>

<h3>Ideia Geral</h3>
<p>Aplicação para gerenciar e designar tarefas, funcionalidades aplicadas em tempo real (webSocket).</p>

<h3>Algumas funcionalidades do APP</h3>

<h2># LOGIN</h2>

<p>O login pede usuário e senha</p>

![](files/login.gif)

<p>- Caso seja o primeiro acesso do usuário, a senha padrão é 1234</p>
<p>- Para acessar a página principal é solicitado que altere a senha padrão</p>

![](files/trocaSenhaLogin.gif)

<h2># CRIAR TAREFA</h2>

<p>- Preenchimento obrigatório de todos os campos para criar a tarefa</p>
<p>- Após a confirmação, a tarefa é adicionada na lista, de forma destacada</p>

![](files/criarTarefa.gif)

<h2># PESQUISAR TAREFA</h2>

<p>Opção de pesquisar a tarefa por descrição ou por funcionário (dono da tarefa)</p>

![](files/pesquisarTarefa.gif)

<h2># INFO USUÁRIO</h2>

<p>- Informações sobre o usuário que efetuou o login</p>
<p>- Alterar a senha pelo app (qualquer usuário)</p>
<p>- Visualizar ranking de pontuação (qualquer usuário)</p>
<p>- Visualizar todas as tarefas (administrador)</p>

![](files/infoUsuarioLogado.gif)

<h2># FILTRAR LISTA DE TAREFAS</h2>

<p>- Filtrar por estado</p>
<p>- Filtrar por companhia, loja e departamento</p>

![](files/filtrarTarefas.gif)

<h2># ITENS NA LINHA</h2>

<p>- O usuário pode ocultar alguns itens da linha da tarefa.</p>

![](files/itensNaLinha.gif)

<h2># ORDENAR LISTA DE TAREFAS</h2>

<p>- O usuário pode ordenar a lista por:</p>
<ul>
<li>Prioridade</li>
<li>Estado</li>
<li>Descrição</li>
<li>Vencimento</li>
</ul>


![](files/ordenarTarefas.gif)

<h2># ATUALIZAR LISTA DE TAREFAS</h2>

<p>- Busca novamente as informações do banco</p>

![](files/atualizarListaTarefas.gif)

<h2># LAYOUT MODAL DA TAREFA</h2>

![](files/modalTarefa.png)

<h2># ALTERAR PRIORIDADE DA TAREFA</h2>

<p>- O usuário pode alterar a prioridade da tarefa</p>
<p>- Somente se a tarefa não estiver nos respectivos estados</p>
<ul>
    <li>Feito</li>
     <li>Cancelado</li>
      <li>Bloqueado</li>
       <li>Parado</li>
</ul>

![](files/alterarPrioridade.gif)


<h2># ALTERAR SENHA DE USUÁRIO</h2>

<p>- O usuário pode alterar a senha diretamente pelo app</p>

![](files/trocaDeSenha.gif)

<h2># ESTADOS DA TAREFA</h2>

<p>Existem 7 estados em que a tarefa pode estar, sendo um deles automático como bloqueio se a tarefa passar do prazo definido</p>
<ul>
    <li>Estados:</li>
    <li>Fazer</li>
    <li>Fazendo</li>
    <li>Análise</li>
    <li>Parado</li>
    <li>Bloqueado</li>
    <li>Feito</li>
    <li>Cancelado</li>
</ul>

![](files/estadosTarefa.gif)

<h2># USUÁRIOS VINCULADOS</h2>

<p>- Visualização de usuários</p>

![](files/usuariosVinculados.gif)

<h2># INFORMAÇÕES USUÁRIOS VINCULADOS - MODAL</h2>

![](files/usuariosVinculadosModal.gif)

<h2># ANEXAR ARQUIVOS NOS TÓPICOS</h2>

<p>- O usuário pode anexar arquivos do tipo: zip, png, jpg, gif, docx, xlsb</p>

![](files/anexoTopico.gif)

<h2># DEFINIR TÓPICO</h2>

<p>- O usuário pode definir tópico com uma questão</p>
<p>- O usuário pode adicionar uma observação ao tópico</p>

![](files/topicoQuestao.gif)

<h2># NOTIFICAÇÃO EM TEMPO REAL</h2>

<p>- A aplicação notifica os usuários de mudanças que ocorrem em tarefas a qual o mesmo está vinculado</p>

![](files/notificacaoTempoReal.gif)

<h2># HISTÓRICO DE NOTIFICAÇÕES</h2>

<p>- A aplicação armazena notificações</p>
<p>- Caso o usuário esteja offline elas são armazenadas no banco de dados, assim que o usário efetuar o login elas serão armazenadas no histórico e apagadas do banco</p>

![](files/historicoNotificacoes.gif)

<h2># MUDANÇAS NA APLICAÇÃO EM TEMPO REAL</h2>

<p>- Todas as mudanças na aplicação por interação dos usuários são efetuadas em tempo real</p>
<p>- No exemplo, o usuário foi vinculado a uma nova tarefa</p>

![](files/mudancasTempoReal.gif)

<h2># RANKING DE USUÁRIOS</h2>

<p>- Conforme os usuários avançam em suas tarefas podem marcar ou perder pontos</p>

![](files/rankingUsuarios.gif)

<h2># DESCONEXÃO AUTOMÁTICA</h2>

<p>- Se a mesma conta for aberta em outro local, ocorre uma desconexão automática</p>
<p>- Somente pode existir um socket conectado por conta</p>

![](files/autoDesconexao.gif)

<h2># HISTÓRICO DE MUDANÇAS NO ESTADO DA TAREFA</h2>


![](files/historicoTarefa.gif)

<h2># WEBCHAT</h2>

<p>- Existe um chat disponível para cada tarefa</p>

![](files/webChat.gif)

<h2># ANEXAR NO CHAT</h2>

<p>- O usuário pode anexar imagens no chat</p>

![](files/anexoChat.gif)

<h2># AVISOS NA TAREFA</h2>

<p>- Existem 3 tipos de avisos dependendo da data final da tarefa</p>
<ul>
<li>X dias para expirar</li>
<li>X dias para começar</li>
<li>X dias que está vencida</li>
</ul>

![](files/expirarAviso.png)
