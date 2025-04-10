import React, { useState, useRef, useEffect } from "react";
import { Menu } from "@headlessui/react";
import { CalendarDays, Bell, Search, LogOut } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const gerarEmpresas = () => {
  const nomes = ["Empresa A", "Empresa B", "Empresa C", "Empresa D", "Empresa E", "Empresa F", "Empresa G", "Empresa H", "Empresa I", "Empresa J", "Empresa K", "Empresa L", "Empresa M", "Empresa N", "Empresa O", "Empresa P", "Empresa Q", "Empresa R", "Empresa S", "Empresa T", "Empresa U", "Empresa V", "Empresa W", "Empresa X", "Empresa Y", "Empresa Z", "Empresa AA", "Empresa AB", "Empresa AC", "Empresa AD"];
  const status = ["para_analisar", "em_analise", "analisado", "pendencias"];
  const analistas = ["João", "Maria", "Carlos", "Ana"];

  return nomes.map((nome, index) => {
    const dataUpload = new Date(Date.now() - Math.floor(Math.random() * 1000000000));
    return {
      id: index + 1,
      nome,
      status: status[Math.floor(Math.random() * status.length)],
      analista: analistas[Math.floor(Math.random() * analistas.length)],
      dataUpload: dataUpload.toLocaleString("pt-BR"),
      registrosPendentes: Math.floor(Math.random() * 20),
    };
  });
};

const statusLabels = {
  para_analisar: "Para Analisar",
  em_analise: "Em Análise",
  analisado: "Analisado",
  pendencias: "Pendências",
};

const Column = ({ title, children, droppableId }) => (
  <div className="w-full md:w-1/4 p-2">
    <div className="bg-white rounded-2xl shadow-lg p-4 min-h-[300px] border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Droppable droppableId={droppableId} isDropDisabled={droppableId === "pendencias"}>
        {(provided, snapshot) => (
          <div
            className={`space-y-2 min-h-[200px] transition-all duration-200 ${
              snapshot.isDraggingOver ? "border-2 border-blue-400 rounded" : ""
            }`}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  </div>
);

const EmpresaCard = ({ id, nome, analista, index, dataUpload, registrosPendentes }) => {
  const analistas = ["João", "Maria", "Carlos", "Ana"];
  const [mostrarMenu, setMostrarMenu] = useState(false);

  return (
    <Draggable draggableId={String(id)} index={index}>
      {(provided) => (
        <div
          className="bg-gray-50 p-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-move relative"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p className="font-medium text-gray-800">{nome}</p>
          <p className="text-sm text-gray-500">Análise anterior: {analista}</p>
          <p className="text-xs text-gray-400">Upload: {dataUpload}</p>
          {registrosPendentes > 0 && (
            <p className="text-xs text-red-600">{registrosPendentes} registros pendentes</p>
          )}
          <div className="mt-2 flex gap-2">
            <button className="text-sm text-blue-600 hover:underline">Ver detalhes</button>
            <div className="relative z-30">
              <button
                className="text-sm text-orange-600 hover:underline"
                onClick={() => setMostrarMenu(!mostrarMenu)}
              >
                Transferir
              </button>
              {mostrarMenu && (
                <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded shadow-md w-40">
                  {analistas.map((nome, i) => (
                    <button
                      key={i}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      onClick={() => {
                        console.log(`Transferido para ${nome}`);
                        setMostrarMenu(false);
                      }}
                    >
                      {nome}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const Sidebar = () => (
  <div className="fixed top-0 left-0 h-full w-56 bg-gradient-to-b from-blue-800 to-blue-600 text-white p-4 shadow-2xl z-40">
    <h1 className="text-2xl font-bold mb-6">Canhoto</h1>
    <nav className="space-y-4">
      <a href="#" className="block hover:underline">Dashboard</a>
      <a href="#" className="block hover:underline">Minhas Análises</a>
      <a href="#" className="block hover:underline">Relatórios</a>
      <a href="#" className="block hover:underline">Configurações</a>
      <a href="#" className="block hover:underline flex items-center gap-2"><LogOut className="w-4 h-4" /> Sair</a>
    </nav>
  </div>
);

const Topbar = () => {
  const nomeUsuario = "Esther";
  const [notificacoes] = useState([
    "Empresa X foi transferida para você",
    "Erro identificado na análise da Empresa Y",
  ]);
  const notificacoesRef = useRef(null);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  useEffect(() => {
    function handleClickFora(event) {
      if (notificacoesRef.current && !notificacoesRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const calcularQuintoDiaUtil = (mes, ano) => {
    const feriadosFixos = [
      `${ano}-01-01`, `${ano}-04-21`, `${ano}-05-01`, `${ano}-09-07`,
      `${ano}-10-12`, `${ano}-11-02`, `${ano}-11-15`, `${ano}-12-25`,
    ];

    let dia = 1;
    let uteis = 0;
    while (uteis < 5) {
      const data = new Date(ano, mes, dia);
      const diaSemana = data.getDay();
      const dataFormatada = data.toISOString().split("T")[0];
      if (diaSemana !== 0 && diaSemana !== 6 && !feriadosFixos.includes(dataFormatada)) {
        uteis++;
      }
      if (uteis < 5) dia++;
    }
    return new Date(ano, mes, dia);
  };

  const quintoDiaUtil = calcularQuintoDiaUtil(new Date().getMonth(), new Date().getFullYear());

  return (
    <div className="md:ml-56 bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-30 border-b border-gray-200">
      <h2 className="text-xl font-semibold">Bom dia, {nomeUsuario}</h2>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          5º dia útil: {quintoDiaUtil.toLocaleDateString("pt-BR")}
        </div>
        <button
          className="flex items-center gap-2 text-sm text-gray-700 hover:underline transition-colors"
          onClick={() => window.open("https://www.feriados.com.br", "_blank")}
        >
          <CalendarDays className="w-5 h-5" /> Ver Feriados
        </button>
        <div className="relative" ref={notificacoesRef}>
          <button
            className="p-2 rounded hover:bg-gray-100 relative transition-colors"
            onClick={() => setMostrarDropdown(!mostrarDropdown)}
          >
            <Bell className="w-6 h-6" />
            {notificacoes.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
                {notificacoes.length}
              </span>
            )}
          </button>
          {mostrarDropdown && notificacoes.length > 0 && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg text-sm z-50 transition-opacity duration-300">
              <ul className="divide-y divide-gray-200">
                {notificacoes.map((msg, i) => (
                  <li key={i} className="p-2 hover:bg-gray-100">{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardAnalista = () => {
  const [empresas, setEmpresas] = useState(gerarEmpresas());
  const [busca, setBusca] = useState("");

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === "pendencias" || destination.droppableId === "pendencias") return;

    const sourceList = empresas.filter(e => e.status === source.droppableId);
    const movedItem = sourceList[source.index];
    movedItem.status = destination.droppableId;

    const updatedEmpresas = empresas.map(e => e.id === movedItem.id ? movedItem : e);
    setEmpresas(updatedEmpresas);
  };

  const grupos = empresas.reduce((acc, empresa) => {
    if (busca && !empresa.nome.toLowerCase().includes(busca.toLowerCase())) return acc;
    acc[empresa.status] = acc[empresa.status] || [];
    acc[empresa.status].push(empresa);
    return acc;
  }, {});

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Sidebar />
      <div className="md:ml-56">
        <Topbar />
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <button className="text-sm text-blue-600 hover:underline">Visão completa</button>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-1 shadow-sm">
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Buscar empresa..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row gap-4">
              {Object.keys(statusLabels).map((statusKey) => (
                <Column key={statusKey} title={statusLabels[statusKey]} droppableId={statusKey}>
                  {(grupos[statusKey] || []).map((empresa, index) => (
                    <EmpresaCard
                      key={empresa.id}
                      id={empresa.id}
                      nome={empresa.nome}
                      analista={empresa.analista}
                      dataUpload={empresa.dataUpload}
                      registrosPendentes={empresa.registrosPendentes}
                      index={index}
                    />
                  ))}
                </Column>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalista;
