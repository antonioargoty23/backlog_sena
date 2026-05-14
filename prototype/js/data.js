/* ═══════════════════════════════════════════════════════════════
   BACKLOG BUILDER · SENA
   data.js — Datos quemados del proyecto SIGMA
   ═══════════════════════════════════════════════════════════════ */

const AppData = {
  proyecto: {
    nombre: "SIGMA – Sistema Integral de Gestión y Monitoreo del Aprendiz",
    dueno: "Instructora Coordinadora SENA"
  },

  epicas: [
    {
      id: "EP01",
      titulo: "Gestión de usuarios, roles y permisos",
      rol: "Como administrador del sistema,",
      deseo: "deseo crear, gestionar y controlar el acceso de usuarios con roles diferenciados (aprendiz, instructor, coordinador),",
      para: "para garantizar que cada actor institucional acceda únicamente a las funcionalidades autorizadas según su perfil."
    },
    {
      id: "EP02",
      titulo: "Registro y administración de aprendices, instructores y grupos",
      rol: "Como coordinador académico,",
      deseo: "deseo registrar aprendices, instructores y grupos de formación en el sistema de manera individual o masiva,",
      para: "para organizar la estructura académica institucional y habilitar el seguimiento formativo de cada grupo."
    },
    {
      id: "EP03",
      titulo: "Observador del Aprendiz",
      rol: "Como instructor,",
      deseo: "deseo registrar y consultar observaciones académicas y convivenciales de los aprendices asignados a mis grupos,",
      para: "para documentar y hacer seguimiento al desempeño formativo y comportamental de cada aprendiz a lo largo del proceso."
    }
  ],

  historias: [
    {
      id: "H01", epicaId: "EP01",
      nombre: "Gestión de Usuarios y Roles Institucionales",
      rol: "Administrador del sistema",
      deseo: "crear y gestionar usuarios del sistema",
      para: "permitir que los actores institucionales puedan acceder a la plataforma.",
      criterios: "El sistema permite crear usuarios con datos básicos obligatorios, la contraseña debe ser por defecto la cédula y modificable.\nNo se permiten usuarios duplicados por documento de identidad.\nCada usuario registrado queda almacenado en el sistema.\nEl administrador puede consultar la información de los usuarios registrados.",
      prioridad: "Alta", sp: "3", sprint: "1", estado: "Por hacer", responsable: "Melva", comentarios: ""
    },
    {
      id: "H02", epicaId: "EP01",
      nombre: "Autenticación Multi-plataforma",
      rol: "Administrador del sistema",
      deseo: "asignar roles y permisos a los usuarios",
      para: "garantizar que cada actor acceda según sus competencias.",
      criterios: "El sistema permite asignar uno o más roles.\nLos permisos se aplican según el rol asignado.\nSolo el coordinador puede gestionar la configuración de permisos.",
      prioridad: "Alta", sp: "3", sprint: "1", estado: "En progreso", responsable: "Carlos", comentarios: ""
    },
    {
      id: "H03", epicaId: "EP01",
      nombre: "Control de Acceso y Permisos",
      rol: "Administrador del sistema",
      deseo: "restringir el acceso según rol",
      para: "garantizar que los usuarios solo operen dentro de sus competencias.",
      criterios: "El sistema valida el rol al intentar acceder a módulos o funcionalidades.\nEl acceso no autorizado es bloqueado automáticamente.",
      prioridad: "Media", sp: "2", sprint: "2", estado: "Por hacer", responsable: "Laura", comentarios: ""
    },
    {
      id: "H04", epicaId: "EP02",
      nombre: "Registro y Vinculación de Aprendices",
      rol: "Administrador del sistema",
      deseo: "registrar aprendices y asociarlos a fichas de formación presencial",
      para: "habilitar su control de acceso y seguimiento según la normativa de formación vigente.",
      criterios: "El sistema permite el ingreso de datos de forma individual (formulario) y masiva.\nSe asigna automáticamente el rol de Aprendiz.\nSe define una contraseña por defecto (documento de identidad).\nEl sistema solo permite asociar aprendices a fichas con estado Activa.",
      prioridad: "Alta", sp: "3", sprint: "2", estado: "Por hacer", responsable: "Jorge", comentarios: ""
    },
    {
      id: "H05", epicaId: "EP02",
      nombre: "Creación y control de grupos",
      rol: "Coordinador Académico",
      deseo: "registrar grupos de formación en el sistema",
      para: "organizar los grupos de aprendices y gestionar su programación académica.",
      criterios: "El sistema permite registrar un nuevo grupo de formación mediante formulario.\nEl número de grupo debe ser único dentro del sistema.\nUna vez registrado queda disponible para asignar aprendices e instructor líder.",
      prioridad: "Media", sp: "3", sprint: "3", estado: "Por hacer", responsable: "Laura Agredo", comentarios: ""
    },
    {
      id: "H06", epicaId: "EP02",
      nombre: "Designación de Instructor Líder",
      rol: "Coordinador Académico",
      deseo: "asignar un instructor líder por cada grupo de formación",
      para: "centralizar la responsabilidad del seguimiento formativo y administrativo de los aprendices.",
      criterios: "El sistema valida que cada grupo tenga un instructor líder activo.\nAl asignar uno nuevo, el anterior pierde automáticamente la etiqueta de líder.\nLa designación es visible en el panel de todos los instructores vinculados.",
      prioridad: "Media", sp: "2", sprint: "3", estado: "Por hacer", responsable: "Anderson", comentarios: ""
    },
    {
      id: "H07", epicaId: "EP03",
      nombre: "Registro de Observaciones Académicas y Convivenciales",
      rol: "Instructor",
      deseo: "registrar observaciones académicas y convivenciales del aprendiz",
      para: "documentar el desempeño del aprendiz dentro del proceso formativo.",
      criterios: "El instructor solo puede registrar observaciones de aprendices de sus grupos asignados.\nEl registro debe incluir: aprendiz, tipo de observación, nivel de severidad, descripción.\nEl sistema registra automáticamente fecha, hora y usuario instructor.\nLa observación no puede ser eliminada, solo consultada.",
      prioridad: "Alta", sp: "3", sprint: "3", estado: "En progreso", responsable: "Anderson", comentarios: "Se entregan los mockups y son validados. Deben corregirse los ajustes."
    },
    {
      id: "H08", epicaId: "EP03",
      nombre: "Consulta de Observaciones por Grupo",
      rol: "Instructor líder de grupo",
      deseo: "consultar las observaciones registradas de los aprendices de mi grupo",
      para: "identificar oportunamente situaciones de riesgo formativo o comportamental.",
      criterios: "El sistema permite filtrar observaciones por aprendiz, tipo o fecha.\nSolo se muestran observaciones del grupo asignado.\nLa consulta muestra autor, fecha y severidad.\nLos registros no pueden ser modificados desde esta vista.",
      prioridad: "Media", sp: "2", sprint: "2", estado: "Por hacer", responsable: "", comentarios: ""
    }
  ],

  tareas: [
    { id: "TR01", huId: "H01", nombre: "Mockups de la interfaz de Gestión de Usuarios", tipo: "RF", estimacion: "2", responsable: "Yuri Tatiana", dependencias: "", prioridad: "ALTA", estado: "0", condicion: "" },
    { id: "TR02", huId: "H01", nombre: "Formulario y Registro", tipo: "RF", estimacion: "3", responsable: "Yuri Tatiana", dependencias: "TR01", prioridad: "ALTA", estado: "0", condicion: "" },
    { id: "TR03", huId: "H01", nombre: "Validaciones de Negocio", tipo: "RF", estimacion: "1", responsable: "Yuri Tatiana", dependencias: "TR02", prioridad: "ALTA", estado: "0", condicion: "" },
    { id: "TR04", huId: "H01", nombre: "Roles y Permisos", tipo: "RF", estimacion: "1", responsable: "Yuri Tatiana", dependencias: "TR03", prioridad: "ALTA", estado: "0", condicion: "" },
    { id: "TR05", huId: "H02", nombre: "Validación de Credenciales", tipo: "RF", estimacion: "1", responsable: "Yuri Tatiana", dependencias: "", prioridad: "ALTA", estado: "0", condicion: "" },
    { id: "TR06", huId: "H02", nombre: "Seguridad y Gestión de Errores", tipo: "RNF", estimacion: "1", responsable: "Yuri Tatiana", dependencias: "TR05", prioridad: "ALTA", estado: "0", condicion: "" },
    { id: "TR07", huId: "H03", nombre: "Definición de la Matriz de Permisos", tipo: "RF", estimacion: "1", responsable: "Yuri Tatiana", dependencias: "", prioridad: "ALTA", estado: "0", condicion: "" },
    { id: "TR08", huId: "H04", nombre: "Registro Individual (Formulario)", tipo: "RF", estimacion: "1", responsable: "Laura", dependencias: "", prioridad: "ALTA", estado: "0", condicion: "" },
    { id: "TR09", huId: "H04", nombre: "Carga Masiva (Excel / Archivo Plano)", tipo: "RF/RNF", estimacion: "1", responsable: "Laura", dependencias: "TR08", prioridad: "ALTA", estado: "0", condicion: "" },
    { id: "TR10", huId: "H07", nombre: "Interfaz de Registro de Observaciones", tipo: "RF", estimacion: "2", responsable: "Anderson", dependencias: "", prioridad: "ALTA", estado: "40", condicion: "Validado con mockups aprobados por coordinación." }
  ]
};
