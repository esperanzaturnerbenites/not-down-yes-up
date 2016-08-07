module.exports = {
	menu:{
		all:{
			name:"PARA TODOS",
			content:[
				{
					"name": "Not Down, ¡Yes Up!",
					"id": "1.1",
					"route": "No Aplica",
					"reference": "allNotDownYesUp",
					"includes": [],
					"image": "![IMAGEN PÁGINA PRINCIPAL](/img/help/1.1.png)",
					"description": "Descripción de la aplicación Not Down, ¡Yes Up!.",
					"guides": [
						"Not Down, ¡Yes Up! es una aplicación Web diseñada para la estimulación temprana en niños y niñas con Síndrome de Down, a través del desarrollo de actividades que estimulan al/la niño/a . Estas actividades son desarrolladas por el/la niño/a con el acompamiento del docente quién es el encargado de velar por que cada actividad se desrrolle de la manera adecuada. Not Down, ¡Yes Up! utiliza ConectionRUG, que es una aplicación de escritorio que permite la conexion entre un tapete electrónico y Not Down, ¡Yes Up!. El tapete electrónico diseñado para el desarrollo de las actividades, permite una interacción directa entre el/la niño/a y el software, lo cual ofrece una estimulación completa, al involucrar actividades que no solo requieran de atención cognitiva, sino del uso de movientos físicos."
					],
					"warnings": [
						"No Aplica."
					]
				},
				{
					"name": "PÁGINA PRINCIPAL Not Down, ¡Yes Up!",
					"id": "1.2",
					"route": "/",
					"reference": "allPaginaPrincipal",
					"includes": [],
					"image": "![IMAGEN PÁGINA PRINCIPAL](/img/help/1.2.png)",
					"description": "Es el inicio de la aplicación Not Down, ¡Yes Up!. Permite pasar a autenticarse o volver al menú principal si ya se encuentra autenticado.",
					"guides": [
						"Al iniciar la aplicación Not Down, ¡Yes Up! estará de inmediato en la página principal.",
						"Existen dos tipos de menú:",
						"Menú de 1 opción: Donde solo esta la opción de autenticación ((A) Botón: INGRESAR)",
						"Menú de 3 opciones: Donde le permite salir del sistema o acceder al menú principal dependiendo de el usuario que se encuentre autenticado ((B) Botones: ADMINISTRACIÓN - ESTIMULACIÓN - SALIR)"
					],
					"warnings": [
						"Verificar la conexión a Internet."
					]
				},
				{
					"name": "AUTENTICACIÓN",
					"id": "1.3",
					"route": "/users/login",
					"reference": "allLogin",
					"includes": ["1.2"],
					"image": "![IMAGEN AUTENTICACIÓN](/img/help/1.2.png)",
					"description": "Permite ingresar a la aplicación Not Down, ¡Yes Up! y sus funciones dependiendo de los permisos de cada usuario.",
					"guides": [
						"Digitar su Usuario y Contraseña en los campos correspondientes (A).",
						"Dar clic en el botón Ingresar (B)."
					],
					"warnings": [
						"Verifique que el usuario y la contraseña sean las correctas.",
						"Verifique que el usuario se encuentre registrado.",
						"Verifique que el usuario se encuentre ACTIVO."
					]
				},
				{
					"name": "SALIR DEL SISTEMA (DESAUTENTICACIÓN)",
					"id": "1.4",
					"route": "No aplica",
					"reference": "allUnlogin",
					"includes": ["1.3", "1.5"],
					"image": "![IMAGEN SALIR DEL SISTEMA (DESAUTENTICACIÓN)](/img/help/1.3.png)",
					"description": "Permite salir por completo de la aplicación Not Down, ¡Yes Up!.",
					"guides": [
						"Para salir del sistema debe encontrarse siempre en el menú principal.",
						"Dar clic en el botón SALIR que se encuentra en la parte superior izquierda (A).",
						"En el cuadro emergente, dar clic en Aceptar (B)."
					],
					"warnings": [
						"Verifique que se encuentre en el menú principal."
					]
				},
				{
					"name": "MENÚ PRINCIPAL",
					"id": "1.5",
					"route": "Varia dependiendo del usuario autenticado.",
					"reference": "allMenuPrincipal",
					"includes": ["1.3"],
					"image": "",
					"description": "Es el menú que contiene las funciones globales que puede ejecutar un usuario dependiendo del tipo de usuario que sea. Este se muestra inmediatamente después de autenticarse.",
					"guides": [
						"Para poder acceder al menú principal debe autenticarse.",
						"Tras autenticarse aparecerá su menú principal."
					],
					"warnings": [
						"No Aplica."
					]
				},
				{
					"name": "AYÚDA Not Down, ¡Yes Up!",
					"id": "1.6",
					"route": "/admin/menu-admin",
					"reference": "admMenuPrincipalAdmin",
					"includes": [],
					"image": "![IMAGEN AYÚDA](/img/help/1.5.png)",
					"description": "Ofrece una ayuda que contiene la información completa acerca de las opciones a las que los usuarios autenticados pueden acceder.",
					"guides": [
						"Dar clic en el ícono de ayuda que se encuentra en la parte superior derecha de la aplicación. Ícono: Niña con un globo en el cual tiene un signo de Pregunta (A).",
						"Este ícono es visible en todas las ventanas del software."
					],
					"warnings": [
						"No Aplica."
					]
				},
			]
		},
		admin:{
			name:"ADMINISTRACIÓN",
			user:{
				name:"USUARIOS",
				content:[
					{
						"name": "MENÚ PRINCIPAL ADMINISTRACIÓN",
						"id": "2.1.1",
						"route": "/users/help-me",
						"reference": "allHelpQuestion",
						"includes": ["1.3"],
						"image": "![IMAGEN MENÚ PRINCIPAL ADMINISTRACIÓN](/img/help/2.1.png)",
						"description": "Permite acceder a todas las opciones del administrador.",
						"guides": [
							"Al autenticarse en el sistema con un usuario de tipo Administrador automáticamente se carga el Menú Principal del Administrador."
						],
						"warnings": [
							"Verifique que se ha autenticado con un usuario de tipo Administrador."
						]
					},
					{
						"name": "REGISTRAR USUARIO NUEVO",
						"id": "2.1.2",
						"route": "/admin/register-user",
						"reference": "admRegisterUser",
						"includes": ["2.1.1"],
						"image": "![IMAGEN REGISTRAR USUARIO NUEV@](/img/help/2.1.2.png)",
						"description": "Permite registrar un nuevo usuario.",
						"guides": [
							"Dar clic en la opción NUEV@ USUARI@ del menú principal. (A)",
							"Digitar el número de cédula del usuario a registrar en el campo 'Cédula' (B).",
							"Dar clic en el botón Iniciar Registro. (C)",
							"Diligenciar todos los campos del formulario. (Los campos de color rojo, son obligatorios).",
							"Sección Nuevo Usuario: En esta sección se diligencian los datos personales, de contacto y profesionales de la persona que se está registrando (D).",
							"Sección Confirmar Registro: En esta sección se asigna un usuario de autenticación para el la persona que se esta registrando(E).",
							"Dar clic en el botón Registrar (F).",
							"El botón Limpiar, elimina toda la información que haya digitado en el formulario (G).",
							"El botón Cancelar, cancela el registro y redirecciona al Menú Principal (H).",
							"Para regresar al Menú Principal dar clic en el botón VOLVER o Cancelar."
						],
						"warnings": [
							"Verifique que el número de cédula sea correcto.",
							"Verifique que el usuario no se encuentre registrado, tanto la persona como el usuario de autenticación.",
							"Verifique que los campos de contraseña sean iguales."
						]
					},
					{
						"name": "CONSULTAR USUARIOS/AS",
						"id": "2.1.3",
						"route": "/admin/admin-users",
						"reference": "admConsulUser",
						"includes": ["2.1.1"],
						"image": "![IMAGEN CONSULTAR USUARIOS/AS](/img/help/2.1.3.png)",
						"description": "Permite consultar los usuarios registrados según la opción seleccionada.",
						"guides": [
							"Dar clic en la opción ADMIN USUARI@S del menú principal (A).",
							"Ubique visualmente la sección Ver Usuarios (B).",
							"Dar clic en las listas desplegable y seleccionar la opción que quiere consultar (C).",
							"Dar clic en el botón Buscar (D).",
							"Hay 2 listas desplegables:",
							"La primera es Tipo de Consulta, en ella puede seleccionar entre consultar por: Administrador, Docente o Todos",
							"La segunda lista es Estado de Usuarios, en ella puede seleccionar entre cosultar por: Inactivo, Activo o Todos.",
							"En el resultado de la consulta el ID de cada usuario es un link para ver información mas detallada del mismo y el campo Editar de cada usuario permite modificar la información de dicho usuario.",
							"Para regresar al Menú Principal dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "DETALLAR UN USUARIO",
						"id": "2.1.4",
						"route": "/admin/admin-users",
						"reference": "admDetailUser",
						"includes": ["2.1.1"],
						"image": "![IMAGEN DETALLAR UN USUARIO](/img/help/2.1.4.png)",
						"description": "Permite consultar la información detallada de un usuario específico.",
						"guides": [
							"Dar clic en la opción ADMIN USUARI@S del menú principal (A).",
							"Consulte el tipo de usuario que desea detallar como se explica en 2.1.3 CONSULTAR USUARIOS/AS.",
							"En el resultado de la consulta dar clic sobre el ID del usuario (B).",
							"Se abre una nueva pestaña donde se muestra toda la información del usuario (C).",
							"Para regresar al Menú Principal debe cerrar la pestaña que se abrió tras la consulta y/o volver a la pestaña anterior (ADMIN USUARI@S), y dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"Verifique que el número de cédula sea correcto."
						]
					},
					{
						"name": "ACTUALIZAR UN USUARIO",
						"id": "2.1.5",
						"route": "/admin/admin-users",
						"reference": "admUpdateUser",
						"includes": ["2.1.1"],
						"image": "![IMAGEN ACTUALIZAR UN USUARIO](/img/help/2.1.5.png)",
						"description": "Permite actualizar la información detallada de un usuario específico.",
						"guides": [
							"Dar clic en la opción ADMIN USUARI@S del menú principal (A).",
							"Consulte el tipo de usuario que desea actualizar como se explica en 2.1.3 CONSULTAR USUARIOS/AS.",
							"En el resultado de la consulta dar clic sobre el link Editar que aparece en la fila del usuario (B).",
							"Se abre una nueva pestaña donde se muestran los campos editables con toda la información del usuario (C).",
							"Modifique el/los campo/s necesarios.",
							"Dar clic en Actualizar (D).",
							"El botón Limpiar, elimina toda la información que haya digitado en el formulario (E).",
							"El botón Cancelar, cancela la actualización de datos, no guarda la información modificada y redirecciona al Menú Principal (F).",
							"Para regresar al Menú Principal debe cerrar la pestaña que se abrió tras la consulta y/o volver a la pestaña anterior (ADMIN USUARI@S), y dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"Verifique que el número de cédula sea correcto."
						]
					},
					{
						"name": "ELIMINAR UN USUARIO",
						"id": "2.1.6",
						"route": "/admin/admin-users",
						"reference": "admDeleteUser",
						"includes": ["2.1.1"],
						"image": "",
						"description": "Permite eliminar un usuario.",
						"guides": [
							"Un usuario no puede ser eliminado.",
							"Un administrador puede inactivar a un usuario de autenticación para que no pueda acceder al sistema."
						],
						"warnings": []
					},
					{
						"name": "ASIGNAR NUEVO USUARIO DE AUTENTICACIÓN",
						"id": "2.1.7",
						"route": "/admin/admin-users",
						"reference": "admNewRol",
						"includes": ["2.1.1"],
						"image": "![IMAGEN ASIGNAR NUEVO USUARIO DE AUTENTICACIÓN](/img/help/2.1.7.png)",
						"description": "Permite asignar a un usuario previamente registrado un nuevo usuario de autenticación.",
						"guides": [
							"Dar clic en la opción ADMIN USUARI@S del menú principal (A).",
							"Ubique visualmente la sección Nuevo Usuario del Sistema (B).",
							"Digitar el número de cédula del usuario al que quiere asignar el nuevo usuario de autenticación(C).",
							"Escribir el nuevo usuario de autenticación y contraseña que serán asignados y seleccionar en la lista desplegable el tipo de usuario que le asiganará (D).",
							"Dar clic en Crear (E).",
							"En el cuadro emergente, dar clic en Aceptar",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"Verifique que el número de cédula sea correcto.",
							"Verifique que el nuevo usuario de autenticación no se encuentre asignado a otro usuario.",
							"Verifique que el el usuario no tenga ya asignado un tipo de usuario como el que intenta asignarlo."
						]
					},
					{
						"name": "ELIMINAR USUARIO DE AUTENTICACIÓN",
						"id": "2.1.8",
						"route": "/admin/admin-users",
						"reference": "admDeleteLogin",
						"includes": ["2.1.1"],
						"image": "![IMAGEN ELIMINAR USUARIO DE AUTENTICACIÓN](/img/help/2.1.8.png)",
						"description": "Permite eliminar un usuario de autenticación.",
						"guides": [
							"Dar clic en la opción ADMIN USUARI@S del menú principal (A).",
							"Ubique visualmente la sección Eliminar Usuario del Sistema (B).",
							"Escribir el usuario de autenticación que quiere eliminar (C).",
							"Dar clic en Eliminar (D).",
							"En el cuadro emergente, dar clic en Aceptar.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana "
						],
						"warnings": [
							"Solo pueden eliminarse usuarios de autenticación que sean de tipo Administrador o Docente que no haya iniciado actividades de estimulación.",
							"Verifique que el número de cédula sea correcto.",
							"Verifique que el nuevo usuario de autenticación no se encuentre asignado a otro usuario.",
							"Verifique que el el usuario no tenga ya asignado un tipo de usuario como el que intenta asignarlo."
						]
					},
					{
						"name": "ACTUALIZAR CONTRASEÑA",
						"id": "2.1.9",
						"route": "/admin/admin-users",
						"reference": "admUpdatePass",
						"includes": ["2.1.1"],
						"image": "![IMAGEN ACTUALIZAR CONTRASEÑA](/img/help/2.1.9.png)",
						"description": "Permite actualizar la contaseña de un usuario de autenticación.",
						"guides": [
							"Dar clic en la opción ADMIN USUARI@S del menú principal (A).",
							"Ubique visualmente la sección Actualizar Contraseña (B).",
							"Escribir el usuario de autenticación al que quiere actualizar la contraseña (C).",
							"Escriba el usuario de autenticación y la nueva contraseña que le será asignada (D).",
							"Dar clic en Actualizar (E).",
							"En el cuadro emergente, dar clic en Aceptar.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana "
						],
						"warnings": [
							"Verifique que el usuario de autenticación sea correcto.",
							"Verifique que los campos de contraseña sean iguales."
						]
					},
					{
						"name": "ACTUALIZAR ROL",
						"id": "2.1.10",
						"route": "/admin/admin-users",
						"reference": "admUpdateRol",
						"includes": ["2.1.1"],
						"image": "![IMAGEN ACTUALIZAR ROL](/img/help/2.1.10.png)",
						"description": "Permite modificar el rol de un usuario (el tipo de usuario).",
						"guides": [
							"Dar clic en la opción ADMIN USUARI@S del menú principal (A).",
							"Ubique visualmente la sección Actualizar Rol (B).",
							"Escribir el usuario de autenticación al que quiere cambiar el rol (C).",
							"En la lista desplegable seleccionar el tipo de rol que quiere asignar (D).",
							"Dar clic en Actualizar (E).",
							"En el cuadro emergente, dar clic en Aceptar.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana "
						],
						"warnings": [
							"Verifique que el usuario de autenticación sea correcto.",
							"Verifique que el usuario de autenticación no tenga actividad en el Centro de Estimulación."
						]
					},
					{
						"name": "ACTUALIZAR ESTADO",
						"id": "2.1.11",
						"route": "/admin/admin-users",
						"reference": "admUpdateStatus",
						"includes": ["2.1.1"],
						"image": "![IMAGEN ACTUALIZAR ESTADO](/img/help/2.1.11.png)",
						"description": "Permite modificar el estado de un usuario (ACTIVO/INACTIVO).",
						"guides": [
							"Dar clic en la opción ADMIN USUARI@S del menú principal (A).",
							"Ubique visualmente la sección Actualizar Estado (B).",
							"Escribir el usuario de autenticación al que quiere cambiar el estado (C).",
							"En la lista desplegable seleccionar el estado que quiere asignar (D).",
							"Dar clic en Actualizar (E).",
							"En el cuadro emergente, dar clic en Aceptar.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"Verifique que el usuario de autenticación sea correcto."
						]
					}
				]
			},
			children:{
				name:"NIÑ@S",
				content:[
					{
						"name": "REGISTRAR NIÑO/A NUEVO/A",
						"id": "2.2.1",
						"route": "/admin/register-children",
						"reference": "admRegisterChild",
						"includes": ["2.1.1"],
						"image": "![IMAGEN REGISTRAR NIÑO/A NUEVO/A](/img/help/2.2.1.png)",
						"description": "Permite registrar un/a nuevo/a niño/a.",
						"guides": [
							"Dar clic en la opción NIÑ@ NUEV@ del menú principal (A).",
							"Digitar el número de identificación del/la niño/a a registrar en el campo 'Número de Identificación' (B).",
							"Dar clic en el botón Iniciar Registro. (C)",
							"Diligenciar todos los campos del formulario. (Los campos de color rojo, son obligatorios) .",
							"Sección Niñ@: En esta sección se diligencian los datos personales y de salud del/la niño/a que se está registrando (D).",
							"Sección Mamá, Papá, Cuidador: En esta sección se diligencian los datos personales, de contacto y profesionales de los familiares del/la niño/a que se está registrando (E).",
							"Dar clic en el botón Registrar (F).",
							"El botón Limpiar, elimina toda la información que haya digitado en el formulario (G).",
							"El botón Cancelar, cancela el registro y redirecciona al Menú Principal (H).",
							"Para regresar al Menú Principal dar clic en el botón VOLVER o Cancelar."
						],
						"warnings": [
							"Verifique que el número de identificación del/la niño/a y el número de cédula de los familiares sean correcto.",
							"Verifique que el/la niño/a no se encuentre registrado/a."
						]
					},
					{
						"name": "DETALLAR UN/A NIÑO/A",
						"id": "2.2.2",
						"route": "/admin/admin-childrens",
						"reference": "admDetailChild",
						"includes": ["2.1.1"],
						"image": "![IMAGEN DETALLAR UN/A NIÑO/A](/img/help/2.2.2.png)",
						"description": "Permite consultar la información detallada de un/a niño/a específico.",
						"guides": [
							"Dar clic en la opción ADMIN NIÑ@S del menú principal (A).",
							"Ubique visualmente la sección General Niñ@s (B).",
							"Digitar el número de identificación del/la niño/a que quiere consultar (C).",
							"Dar clic en el botón Ver Info (D).",
							"Se abre una nueva pestaña donde se muestra toda la información del/la niño/a (E).",
							"Navegue en el menú que aparece para observar toda la información detallada.",
							"Opción INFORMACIÓN NIÑ@, muestra la información personal, de contacto y de salud del/la niño/ña (F).",
							"Opción DATOS FAMILIARES, muestra la información de los familiares del/la niño/a (G).",
							"Opción ETAPAS, muestra la información de las etapas (H).",
							"Opción ACTIVIDADES VALIDADAS, muestra la información de las actividades validadas (I).",
							"Opción HISTORIAL DE ACTIVIDADES, muestra el historial de todas las actividades que ha desarrollado el/la niño/a (J).",
							"Para regresar al Menú Principal debe cerrar la pestaña que se abrió tras la consulta y/o volver a la pestaña anterior (ADMIN NIÑ@S), y dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"Verifique que el número de identificación sea correcto."
						]
					},
					{
						"name": "ACTUALIZAR UN/A NIÑO/A",
						"id": "2.2.3",
						"route": "/admin/admin-childrens",
						"reference": "admUpdateChild",
						"includes": ["2.1.1"],
						"image": "![IMAGEN ACTUALIZAR UN/A NIÑO/A](/img/help/2.2.3.png)",
						"description": "Permite actualizar la información detallada de un/a niño/a específico.",
						"guides": [
							"Dar clic en la opción ADMIN NIÑ@S del menú principal (A).",
							"Ubique visualmente la sección General Niñ@s (B).",
							"Digitar el número de identificación del/la niño/a que quiere actualizar (C).",
							"Dar clic en el botón Actualizar (D).",
							"Se abre una nueva pestaña donde se muestran los campos editables con toda la información del/la niño/a (E).",
							"Modifique el/los campo/s necesarios.",
							"Dar clic en Actualizar (F).",
							"El botón Limpiar, elimina toda la información que haya digitado en el formulario (G).",
							"El botón Cancelar, cancela la actualización de datos, no guarda la información modificada y redirecciona al Menú Principal (H).",
							"Para regresar al Menú Principal debe cerrar la pestaña que se abrió tras la consulta y/o volver a la pestaña anterior (ADMIN NIÑ@S), y dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"Verifique que el número de identificación sea correcto."
						]
					},
					{
						"name": "ELIMINAR UN/A NIÑO/A",
						"id": "2.2.4",
						"route": "/admin/admin-childrens",
						"reference": "admDeleteChild",
						"includes": ["2.1.1"],
						"image": "",
						"description": "Un/a niño/a no puede ser eliminado.",
						"guides": [
							"Un/a niño/a no puede ser eliminado por un usuario.",
							"Un administrador puede inactivar a un/a niño/a para que no pueda realizar actividades de estimulación."
						],
						"warnings": [
							"Contacte al desarrollador en caso de requerir eliminar un/a niño/a."
						]
					},
					{
						"name": "CAMBIAR ESTADO NIÑO/A",
						"id": "2.2.5",
						"route": "/admin/admin-childrens",
						"reference": "admStatusChild",
						"includes": ["2.1.1"],
						"image": "![IMAGEN CAMBIAR ESTADO NIÑO/A](/img/help/2.2.5.png)",
						"description": "Permite inactivar un/a niño/a.",
						"guides": [
							"Dar clic en la opción ADMIN NIÑ@S del menú principal (A).",
							"Ubique visualmente la sección Cambiar Estado Niñ@ (B).",
							"Digitar el número de identificación del/la niño/a (C).",
							"En la lista desplegable seleccionar el estado que quiere asignar (D).",
							"Escribir las observaciones necesarias (E).",
							"Dar clic en Cambiar Estado (F).",
							"En el cuadro emergente, dar clic en Aceptar.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"Verifique que el número de identificación sea correcto."
						]
					},
					{
						"name": "VALIDAR ETAPA",
						"id": "2.2.6",
						"route": "/admin/admin-childrens",
						"reference": "admValidStep",
						"includes": ["2.1.1"],
						"image": "![IMAGEN VALIDAR ETAPA](/img/help/2.2.6.png)",
						"description": "Permite validar la etapa de un/a niño/a.",
						"guides": [
							"Dar clic en la opción ADMIN NIÑ@S del menú principal (A).",
							"Ubique visualmente la sección Validar Etapa (B).",
							"En la lista desplegable seleccionar la etapa a validar (C).",
							"Digitar el número de identificación del/la niño/a (D).",
							"Dar clic en Validar (E).",
							"Verificar la información que aparece y escribir las observaciones necesarias (F).",
							"Dar clic en Validar Etapa (G).",
							"En el cuadro emergente, dar clic en Aceptar.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"Verifique que el número de identificación sea correcto.",
							"Validar que las condiciones para la validación de la etapa se cumplan."
						]
					}
				]
			},
			reports:{
				name:"REPORTES",
				content:[
					{
						"name": "CONSULTAS GENERALES NIÑOS/AS Y DOCENTES",
						"id": "2.3.1",
						"route": "/admin/reports",
						"reference": "admReportGeneral",
						"includes": ["2.1.1"],
						"image": "![IMAGEN CONSULTAS GENERALES NIÑOS/AS Y DOCENTES](/img/help/2.3.1.png)",
						"description": "Permite generar reportes basados en consultas generales de niños/as y docentes.",
						"guides": [
							"Dar clic en la opción REPORTES del menú principal (A).",
							"Ubique visualmente la sección Consultas Generales Niñ@s o Consultas Generales Docentes (B).",
							"En la lista desplegable seleccionar la consulta a realizar (C).",
							"Dar clic en Consultar (D).",
							"Opción Inactivo muestra todos los niños/as o docentes inactivos en el sistema.",
							"Opción Activo muestra todos los niños/as o docentes activos en el sistema.",
							"Opción Todos por Etapas muestra todos los niños/as o docentes.",
							"Al consultar niños/as con estado activo, aparece una opción adicional para consultar por el estado de estimulación. Opciones: Registrado, En Cursos, Calificado, Retirado y Todos.",
							"En el resultado de la consulta el ID de cada niño/usuario es un link para ver información mas detallada del mismo.",
							"Puede exportar el reporte a un archivo PDF al dar clic en el botón Generar PDF que aparece tras realizar la consulta.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"Verifique que el número de identificación sea correcto."
						]
					},
					{
						"name": "CONSULTA POR NIÑO/A",
						"id": "2.3.2",
						"route": "/admin/reports",
						"reference": "admReportChild",
						"includes": ["2.1.1"],
						"image": "![IMAGEN CONSULTA POR NIÑO/A](/img/help/2.3.2.png)",
						"description": "Permite consultar la información detallada de un niño/a.",
						"guides": [
							"Dar clic en la opción REPORTES del menú principal (A).",
							"Ubique visualmente la sección Consulta por Niñ@ (B).",
							"Digitar el número de identificación del/la niño/a (C).",
							"Dar clic en Consultar (D).",
							"Se abre una nueva pestaña donde se muestra toda la información del/la niño/a (E).",
							"Navegue en el menú que aparece para observar toda la información detallada.",
							"Opción INFORMACIÓN NIÑ@, muestra la información personal, de contacto y de salud del/la niño/ña (F).",
							"Opción DATOS FAMILIARES, muestra la información de los familiares del/la niño/a (G).",
							"Opción ETAPAS, muestra la información de las etapas (H).",
							"Opción ACTIVIDADES VALIDADAS, muestra la información de las actividades validadas (I).",
							"Opción HISTORIAL DE ACTIVIDADES, muestra el historial de todas las actividades que ha desarrollado el/la niño/a (J).",
							"Puede exportar toda la información a un archivo PDF al dar clic en el botón Generar PDF que aparece tras realizar la consulta.",
							"Para regresar al Menú Principal debe cerrar la pestaña que se abrió tras la consulta y/o volver a la pestaña anterior (ADMIN USUARI@S), y dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"Verifique que el número de identificación sea correcto."
						]
					},
					{
						"name": "CONSULTA POR EDADES",
						"id": "2.3.3",
						"route": "/admin/reports",
						"reference": "admReportAge",
						"includes": ["2.1.1"],
						"image": "![IMAGEN CONSULTA POR EDADES](/img/help/2.3.3.png)",
						"description": "Permite consultar los niños/as que se encuentran en edades determinadas.",
						"guides": [
							"Dar clic en la opción REPORTES del menú principal (A).",
							"Ubique visualmente la sección Consulta por Edades (B).",
							"Seleccionar en la lista desplegable el tipo de consulta que quiere generar (C).",
							"Digitar la edad en meses que quiere consultar (D).",
							"Dar clic en Consultar (E).",
							"Opción Exacta, consulta todos los niños/as que tienen la edad especificada.",
							"Opción Mayor Que consulta todos los niños/as que tienen una edad mayor a la especificada.",
							"Opción Menor Que consulta todos los niños/as que tienen una edad menor a la especificada.",
							"En el resultado de la consulta el ID de cada niño es un link para ver información mas detallada del mismo.",
							"Puede exportar toda la información a un archivo PDF al dar clic en el botón Generar PDF que aparece tras realizar la consulta.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "CONSULTA POR ETAPAS",
						"id": "2.3.4",
						"route": "/admin/reports",
						"reference": "admReportStep",
						"includes": ["2.1.1"],
						"image": "![IMAGEN CONSULTA POR ETAPAS](/img/help/2.3.4.png)",
						"description": "Permite consultar los niños/as que se encuentran en determinada etapa.",
						"guides": [
							"Dar clic en la opción REPORTES del menú principal (A).",
							"Ubique visualmente la sección Consulta por Etapa (B).",
							"Seleccionar en la lista desplegable la etapa que quiere consultar (C).",
							"Dar clic en Consultar (D).",
							"En el resultado de la consulta el ID de cada niño es un link para ver información mas detallada del mismo.",
							"Puede exportar toda la información a un archivo PDF al dar clic en el botón Generar PDF que aparece tras realizar la consulta.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "CONSULTA POR ACTIVIDAD",
						"id": "2.3.5",
						"route": "/admin/reports",
						"reference": "admReportActivity",
						"includes": ["2.1.1"],
						"image": "![IMAGEN CONSULTA POR ACTIVIDAD](/img/help/2.3.5.png)",
						"description": "Permite consultar los niños/as que se encuentran en determinada actividad.",
						"guides": [
							"Dar clic en la opción REPORTES del menú principal (A).",
							"Ubique visualmente la sección Consulta por actividades (B).",
							"Seleccionar en las dos listas desplegables la etapa y la actividad específica que quiere consultar (C).",
							"Dar clic en Consultar (D).",
							"En el resultado de la consulta el ID de cada niño es un link para ver información mas detallada del mismo.",
							"Puede exportar toda la información a un archivo PDF al dar clic en el botón Generar PDF que aparece tras realizar la consulta.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "GENERACIÓN DE REPORTE FINAL",
						"id": "2.3.6",
						"route": "/admin/reports",
						"reference": "admReportFinal",
						"includes": ["2.1.1"],
						"image": "![IMAGEN GENERACIÓN DE REPORTE FINAL](/img/help/2.3.7.png)",
						"description": "Permite generar el reporte final de un/a niño/a.",
						"guides": [
							"Dar clic en la opción REPORTES del menú principal (A).",
							"Ubique visualmente la sección Reporte Final (B).",
							"Digite el número de identificación del niño/a (C).",
							"Dar clic en Generar Reporte Final (D).",
							"Se genera un archivo en PDF que se descarga automáticamente.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "CONSULTA DE NIÑOS/AS POR DOCENTE",
						"id": "2.3.7",
						"route": "/admin/reports",
						"reference": "admReportChildToTeacher",
						"includes": ["2.1.1"],
						"image": "![IMAGEN CONSULTA DE NIÑOS/AS POR DOCENTE](/img/help/2.3.3.png)",
						"description": "Permite consultar los niños/as que han sido evaluados por un docente específico.",
						"guides": [
							"Dar clic en la opción REPORTES del menú principal (A).",
							"Ubique visualmente la sección Consulta de Niñ@s por Docente (B).",
							"Seleccionar en la lista desplegable Docente el docente al cual quiere consultar (C).",
							"Seleccionar en la lista desplegable Etapa la etapa por la cual quiere consultar (D).",
							"Dar clic en Consultar (E).",
							"En el resultado de la consulta el ID de cada niño es un link para ver información mas detallada del mismo.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "CALENDARIO DE ACTIVIDADES",
						"id": "2.3.8",
						"route": "/admin/reports",
						"reference": "admReportChildToTeacher",
						"includes": ["2.1.1"],
						"image": "![IMAGEN CALENDARIO DE ACTIVIDADES](/img/help/2.3.8.png)",
						"description": "Genera una consulta gráfica de un calendario que muestra los dias en los cuales los/as niños/as han realizado actividades.",
						"guides": [
							"Dar clic en la opción REPORTES del menú principal (A).",
							"Ubique visualmente la sección Calendario de Actividades (B).",
							"Digitar el número de identificación del/la niño/a que desea consultar (C).",
							"Digitar los rangos de fechas que desea consultar, siendo primero la fecha inicial y luego la fecha final (D).",
							"Dar clic en Consultar (E).",
							"Puede exportar toda la información a un archivo PDF al dar clic en el botón Generar PDF que aparece tras realizar la consulta.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"Verifique que las fechas sean correctas.",
							"Verifique que el número de identificación sea correcto."
						]
					}
				]
			},
			backup:{
				name:"BACKUP",
				content:[
					{
						"name": "SALVAR INFORMACIÓN (BACKUPS)",
						"id": "2.4.1",
						"route": "/admin/backup",
						"reference": "admSaveBackup",
						"includes": ["2.1.1"],
						"image": "![IMAGEN SALVAR INFORMACIÓN (BACKUPS)](/img/help/2.4.1.png)",
						"description": "Permite hacer un backup de la información del sistema.",
						"guides": [
							"Dar clic en la opción BACKUPS del menú principal (A).",
							"Dar clic en el botón Realizar Backup (B).",
							"Automáticamente se descarga un archivo correspondiente al backup en la carpeta de Descargas (Download).",
							"Guardar el archivo del backup en una carpeta segura.",
							"Para regresar al Menú Principal debe dar clic en el botón VOLVER que se encuentra en la parte superior izquierda de la ventana."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "RESTAURAR BACKUPS (RECUPERAR INFORMACIÓN)",
						"id": "2.4.2",
						"route": "/admin/backup",
						"reference": "admRecoveryBackup",
						"includes": ["2.1.1"],
						"image": "",
						"description": "Permite recuperar la información del sistema.",
						"guides": [
							"La restauración de backups solo puede ser realizada por un experto."
						],
						"warnings": [
							"En caso de perder información del sistema y requerir una restauración contacte al desarrollador."
						]
					}
				]
			}
		},
		estimulation:{
			name:"ESTIMULACIÓN",
			general:{
				name:"GENERAL",
				content:[
					{
						"name": "ENTRAR AL CENTRO DE ESTIMULACIÓN Not Down, ¡Yes Up!",
						"id": "3.1.1",
						"route": "No aplica",
						"reference": "estEstimulation",
						"includes": ["1.3"],
						"image": "",
						"description": "Permite acceder al Centro de Estimulación de Not Down, ¡Yes Up!.",
						"guides": [
							"Debe autenticarse con un usuario tipo Docente.",
							"Ver 1.3 AUTENTICACIÓN."
						],
						"warnings": [
							"Verifique que el usuario sea de tipo Docente.",
							"Verifique que el usuario se encuentre activo."
						]
					},
					{
						"name": "MENÚ PRINCIPAL ESTIMULACIÓN",
						"id": "3.1.2",
						"route": "/estimulation/menu-teacher",
						"reference": "estMenuEstimulation",
						"includes": ["3.1.1"],
						"image": "![IMAGEN MENÚ PRINCIPAL ESTIMULACIÓN](/img/help/3.1.2.png)",
						"description": "Permite acceder a todas las opciones del Profesor.",
						"guides": [
							"Al autenticarse en el sistema con un usuario de tipo Docente automáticamente se carga el Menú Principal del Profesor."
						],
						"warnings": [
							"Verifique que se ha autenticado con un usuario de tipo Docente"
						]
					}
				]
			},
			steps:{
				name:"ETAPAS",
				content:[
				
					{
						"name": "VER LAS ETAPAS",
						"id": "3.2.1",
						"route": "/estimulation/steps",
						"reference": "estViewSteps",
						"includes": ["3.1.2"],
						"image": "![IMAGEN VER LAS ETAPAS](/img/help/3.2.1.png)",
						"description": "Permite acceder al menú de las etapas.",
						"guides": [
							"Dar clic en el botón INICIAR (A).",
							"Para regresar al Menú Principal debe dar clic en el botón TERMINAR que se encuentra en la parte superior derecha de la ventana (B)."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "DETALLAR UNA ETAPA",
						"id": "3.2.2",
						"route": "/estimulation/steps",
						"reference": "estDetailStep",
						"includes": ["3.1.3"],
						"image": "![IMAGEN DETALLAR UNA ETAPA](/img/help/3.2.2.png)",
						"description": "Permite acceder al menú de actividades y a la información de una etapa.",
						"guides": [
							"Dar clic sobre el número de la etapa a la que quiere acceder (A).",
							"Para regresar al menú anterior debe dar clic en el botón VOLVER que se encuentra en la parte superior derecha de la ventana (B)."
						],
						"warnings": [
							"No Aplica."
						]
					}
				]
			},
			activities:{
				name:"ACTIVIDADES",
				content:[
					{
						"name": "VER ACTIVIDADES DE UNA ETAPA",
						"id": "3.3.1",
						"route": "/estimulation/steps",
						"reference": "estDetailStep",
						"includes": ["3.2.2"],
						"image": "",
						"description": "Permite acceder al menú de actividades de una etapa.",
						"guides": [
							"Ver DETALLAR UNA ETAPA."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "INGRESAR A UNA ACTIVIDAD",
						"id": "3.3.2",
						"route": "/estimulation/steps/:step/:activity",
						"reference": "estEnterActivity",
						"includes": ["3.3.1"],
						"image": "![IMAGEN INGRESAR A UNA ACTIVIDAD](/img/help/3.3.2.png)",
						"description": "Permite acceder a una actividad y a la información de ella.",
						"guides": [
							"Dar clic sobre el número de la actividad a la que quiere acceder (A).",
							"Para regresar al menú anterior debe dar clic en el botón VOLVER que se encuentra en la parte superior derecha de la ventana (B)."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "INICIAR UNA ACTIVIDAD",
						"id": "3.3.3",
						"route": "/estimulation/steps/:step/:activity",
						"reference": "estStartActivity",
						"includes": ["3.3.2"],
						"image": "![IMAGEN INICIAR UNA ACTIVIDAD](/img/help/3.3.3.png)",
						"description": "Permite acceder a las opciones completas de una actividad.",
						"guides": [
							"Digitar el número de identificación del/la niño/a (A).",
							"Dar clic en el botón Iniciar Actidad (B).",
							"Para cancelar una actidad debe dar clic en Reiniciar Actidad (C)."
						],
						"warnings": [
							"Verifique que el número de identificación sea correcto",
							"Verifique que el/la niño/a se encuentre activo o que no se encuentre retirado"
						]
					},
					{
						"name": "MENÚ DE UNA ACTIVIDAD",
						"id": "3.3.4",
						"route": "/estimulation/steps/:step/:activity",
						"reference": "estMenuActivity",
						"includes": ["3.3.3"],
						"image": "![IMAGEN MENÚ DE UNA ACTIVIDAD](/img/help/3.3.4.png)",
						"description": "Descripción de las partes de una actividad.",
						"guides": [
							"Título de la actividad: Muestra el número de la etapa, y el número y nombre de la actidad que se ha iniciado (A).",
							"Menú superior: Contiene 3 botones: (B).",
							"Reiniciar Actividad: Reinicia y cancela la actividad.",
							"Validación Parcial: Despliega un formulario que permite validar parcialmente la actividad.",
							"Validación Final: Despliega un formulario que permite validar definitivamente la actividad.",
							"Descripción de la actividad: Muestra la descripción de una actividad (C).",
							"Selección de un/a niño/a: Permite iniciar la actividad con el/la niño/a digitado (D).",
							"Niño/a Actual: Muestra el nombre, identificación y foto del/la niño/a sesleccionado. Tambien permite ver información detallada del/la niño/a (E).",
							"Guía: Muestra la guía del profesor para desarrollar la actividad. También permite desarrollar la actividad de apoyo (F).",
							"Contenedor actividad: Es el espacio que observará el/la niño/a durante la actividad. Se divide en 2, ¡LÉEME! y ¡ESCÚCHAME!:",
							"¡LÉEME!: Muestra la guía del/la niño/a y el resultado del desarrollo de la actividad. Permite escuchar la guía del/la niño/a. (G).",
							"¡ESCÚCHAME!: Muestra las imágenes para el desarrollo de la actividad y las opciones de reproducción de audio (H)."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "REINICIAR O CANCELAR ACTIVIDAD",
						"id": "3.3.5",
						"route": "/estimulation/steps/:step/:activity",
						"reference": "estRestartActivity",
						"includes": ["3.3.3"],
						"image": "![IMAGEN REINICIAR O CANCELAR ACTIVIDAD](/img/help/3.3.5.png)",
						"description": "Cancela una actividad.",
						"guides": [
							"Dar clic en el botón Reiniciar Actividad (A)."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "DETALLAR UN/A NIÑ/A",
						"id": "3.3.6",
						"route": "/estimulation/steps/:step/:activity",
						"reference": "estDetailChild",
						"includes": ["3.3.3"],
						"image": "![IMAGEN DETALLAR UN/A NIÑ/A](/img/help/3.3.6.png)",
						"description": "Permite ver la información detallada de un/a niño/a.",
						"guides": [
							"Ubique visualmente la sección Niñ@ Actual (A).",
							"Dar clic en la imagen del/a niño/a (B).",
							"Se abre una nueva pestaña donde se muestra toda la información del/a niño/a.",
							"La nueva pestaña muestra inicialmente información básica del/a niño/a, dividida así:",
							"Datos Niñ@: Muestra el nombre, la identificación, la edad y la foto. Adicionalmente, tiene el botón Ver Más, el cual muestra información mas detallada de la información personal, de contacto y de salud (C).",
							"Historial de Actividades (Progreso): Muestra las últimas 10 actividades desarrolladas por el/la niño/a, la etapa correspondiente y el estado de dicha actividad. Adicionalmente, tiene el botón Ver Más, el cual muestra un menú con cada una de las etapas existentes. Al dar clic en cualquiera de las etapas del menú, se muestra la información detallada del historial de las actividades de esa etapa desarrolladas por el/la niño/a (D).",
							"Últimos logros alcanzados: Muestra la últim etapa validada y la cantidad de actividades completadas y pendientes de dicha etapa. Adicionalmente, tiene el botón Ver Todo, el cual muestra las actividades validadas en dicha etapa (E).",
							"Última actividad accedida: Muestra el nombre, la etapa, el estado y la fecha de la última actividad accedida (F).",
							"Para regresar al desarrollo de la actividad debe cerrar la pestaña que se abrió tras la consulta y/o volver a la pestaña anterior.",
							"Para volver al menú anterior dar clic en el botón VOLVER que se encuentra en la parte superior derecha de la ventana"
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "ACTIVIDAD DE APOYO",
						"id": "3.3.7",
						"route": "/estimulation/steps/:step/:activity",
						"reference": "estSupportActivity",
						"includes": ["3.3.3"],
						"image": "![IMAGEN ACTIVIDAD DE APOYO](/img/help/3.3.7.png)",
						"description": "Permite realizar la actividad de apoyo, para el refuerzo de conocimientos.",
						"guides": [
							"Ubique visualmente la sección Guía (A).",
							"Dar clic en el botón Actividad de Apoyo (B).",
							"Se despliega la sección Aprendamos Juntos (C).",
							"Poner el cursor sobre una imagen para ampliarla. Lo cual le permite al niño/a fijarse en esta (D).",
							"Dar clic a la imagen para que se escuche la frase descriptiva de la imagen.",
							"Realizar lo mismo con cada imagen visible."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "VALIDACIÓN PARCIAL DE UNA ACTIVIDAD",
						"id": "3.3.8",
						"route": "/estimulation/steps/:step/:activity",
						"reference": "estValidParcial",
						"includes": ["3.2.3"],
						"image": "![IMAGEN VALIDACIÓN PARCIAL DE UNA ACTIVIDAD](/img/help/3.3.8.png)",
						"description": "Permite validar parcialmente una actividad.",
						"guides": [
							"La validación parcial de una actividad hace referencia a calificar una actividad desarrollada a modo de enseñanza.",
							"Dar clic en el botón Validación Parcial para mostrar u ocultar la sección de validación parcial (A).",
							"Se muestra la sección Validación Actividad (B).",
							"Validar la información que se muestra (C).",
							"Digitar la calificación obtenida en el campo Puntuación Docente, seleccionar en la lista desplegable Estado de la Actividad el indicador correspondiente y, escribir las observaciones respectivas (D).",
							"Dar clic en el botón Validar (E)."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "VALIDACIÓN FINAL DE UNA ACTIVIDAD",
						"id": "3.3.9",
						"route": "/estimulation/steps/:step/:activity",
						"reference": "estValidDefinitive",
						"includes": ["3.3.3"],
						"image": "![IMAGEN VALIDACIÓN FINAL DE UNA ACTIVIDAD](/img/help/3.3.9.png)",
						"description": "Permite validar definitivamente una actividad.",
						"guides": [
							"La validación final de una actividad hace referencia a calificar una actividad desarrollada a para evaluar el desempeño del/la niño/a.",
							"Dar clic en el botón Validación Final para mostrar u ocultar la sección de validación final (A).",
							"Se muestra la sección Validación Final Actividad (B).",
							"Validar la información que se muestra (C).",
							"Digitar la calificación obtenida en el campo Puntuación Docente (D).",
							"Seleccionar en las listas desplegables (Estado de la Actividad, Apoyo Máximo, Apoyo Mínimo, D. Funcional) el indicador correspondiente a cada una (E).",
							"Escribir las observaciones correspondientes (F).",
							"Dar clic en el botón Validar (G)."
						],
						"warnings": [
							"Verifique que cumpla con las condiciones requeridas para la validación final de la actividad"
						]
					}
				]
			},
			rug:{
				name:"TAPETE ELECTRÓNICO",
				content:[
				
					{
						"name": "DESCRIPCIÓN",
						"id": "3.4.1",
						"route": "No Aplica",
						"reference": "estRugDescription",
						"includes": [],
						"image": "![IMAGEN DESCRIPCIÓN](/img/help/3.4.1.png)",
						"description": "Conozca lo que es el tapete electrónico.",
						"guides": [
							"El tapete electrónico es una herramienta diseñada para el desarrollo de las actividades en Not Down, ¡Yes Up!.",
							"Este permite la interacción directa entre el/la niño/a y el software ofreciendo una estimulación mas completa.",
							"El tapete esta diseñado con elementos reciclados en pro de generar un aporte positivo al medio ambiente.",
							"Toda actividad desarrollada por los/las niños/as con el tapete debe ser bajo la supervisión de un adulto responsable, previamente capacitado para el uso del mismo.",
							"El tapete cuenta con la seccion de fichas, que es la parte con la cual el/a niño/a va a interactuar (A).",
							"En esta sección hay 4 espacios o lugares marcados con un número consecutivo de 1 hasta 4 (B).",
							"En estos espacios se ubican los contenedores con sus fichas correspondientes."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "CONEXIÓN",
						"id": "3.4.2",
						"route": "No Aplica",
						"reference": "estRugConection",
						"includes": [],
						"image": "![IMAGEN CONEXIÓN](/img/help/3.4.2.png)",
						"description": "Muestra la forma de conectar el tapete electrónico.",
						"guides": [
							"Para hacer la conexión del tapete electrónico debe conectar el cable USB del tapete al puerto USB del computador.",
							"Debe tener en cuenta que el cable USB del tapete tiene un largor de 1.5 metros."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "CUIDADO Y SEGURIDAD",
						"id": "3.4.3",
						"route": "No Aplica",
						"reference": "estRugCareSecurity",
						"includes": [],
						"image": "![IMAGEN CUIDADO Y SEGURIDAD](/img/help/3.4.3.png)",
						"description": "Permite conocer las indicaciones de cuidado y seguridad del tapete electrónico.",
						"guides": [
							"Debe tener en cuenta que este tapete es completamente hecho a mano humana, con productos reutilizables libres de contaminación.",
							"Para un mayor cuidado, no permita que sea utilizado por personas que no tengan la capacitación adecuada para su uso.",
							"Tampoco permita que los/las niños/as jueguen con el tapete como si fuera un juguete regular.",
							"Siempre que los/as niños/as interactúen con el tapete vigile que se le este dando un uso adecuado.",
							"El tapete esta diseñado para recibir presión sobre la sección de fichas, pero esta presión debe ser considerable, no pueden ser golpes fuertes.",
							"El tapete no debe caerse ni mojarse o humedecerse.",
							"No debe halar nunca el cable USB.",
							"Prefereiblemente, mantenga la torre del computador en suelo mientras se realizan las actividades con el tapete electrónico.",
							"El tapete electrónico está correctamente diseñado para que ningún circuito eléctrico este visible o accesible al usuario final.",
							"Nunca intente desatapar el tapete electrónico ni manipular sus circuitos eléctricos.",
							"Siempre, al terminar de usar en tapete, debe guardarse en su empaque original.",
							"Si el tapete electrónico presenta alguna falla o daño llame al administrador."
						],
						"warnings": [
							"No Aplica."
						]
					}
				]
			},
			connectionRug:{
				name:"DESARROLLAR ACTIVIDADES",
				content:[
				
					{
						"name": "ACCESO A ConectionRUG",
						"id": "3.5.1",
						"route": "No Aplica",
						"reference": "estAccessConectRug",
						"includes": [],
						"image": "",
						"description": "Permite la conexión del tapete electrónico.",
						"guides": [
							"Para el desarrollo de una actividad acceder a la aplicación de escritorio ConectionRUG.",
							"ConectionRUG permite conectar el tapete electrónico con la aplicación Not Down, ¡Yes Up! para el envio de los datos.",
							"Para acceder a ConectionRUG debe abrir la aplicación de escritorio dando doble clic en el acceso directo que encuentra en el escritorio."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "VALIDACIONES EN ConectionRUG",
						"id": "3.5.2",
						"route": "No Aplica",
						"reference": "estValidConectRug",
						"includes": ["3.5.1"],
						"image": "![IMAGEN VALIDACIONES EN ConectionRUG](/img/help/3.5.2.png)",
						"description": "Conozca las validaciones previas para el correcto funcionamiento del tapete electrónico.",
						"guides": [
							"Para el correcto funcionamiento del tapete, debe hacer unas validaciones previas al inicio de una actividad.",
							"Autenticación de usuario: Al iniciar la aplicación ConectionRUG, aparece la ventana de autenticación, debe digitar su usuario y contraseña para poder continuar (A).",
							"Acceso a Internet: Antes de hacer la conexión, debe validar que se encuentre conectado a Internet. Para esto verifique en el ícono de Acceso a Internet se encuentre en color verde, o ponga el cursor sobre el ícono para que aparezca el estado (B).",
							"Si el ícono de Acceso a Internet se encuentra en rojo, significa que no está conectado a Internet."
						],
						"warnings": [
							"Verifique su conexión a Internet.",
							"Verifique que su usuario y contraseña sean correctos."
						]
					},
					{
						"name": "SELECCIÓN DE FICHAS",
						"id": "3.5.3",
						"route": "No Aplica",
						"reference": "estSelectRecords",
						"includes": [],
						"image": "![IMAGEN SELECCIÓN DE FICHAS](/img/help/3.5.3.png)",
						"description": "Selección de fichas para la actividad.",
						"guides": [
							"Cada actividad a desarrollar tiene 4 fichas dedicadas, exlusivas para el uso de dicha actividad.",
							"En el anverso (A) cada ficha tiene una imagen referente a la actividad en desarrollo y en el reverso (B) la referencia a la actividad (EJ: E1 - A1, donde E1 significa Etapa 1 y, donde A1, significa Actividad 1, es decir, esa ficha correspondería a la Actividad 1 de la Etapa 1.).",
							"Para desarrollar una actividad debe buscar las 4 fichas que tienen la referencia de dicha actividad en su anverso."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "UBICACIÓN DE FICHAS (Concordancia PIN-FICHA)",
						"id": "3.5.4",
						"route": "No Aplica",
						"reference": "estLocationRecords",
						"includes": [],
						"image": "![IMAGEN UBICACIÓN DE FICHAS (Concordancia PIN-FICHA)](/img/help/3.5.4.png)",
						"description": "Ubicación de fichas en el tapete electrónico (Concordancia PIN-FICHA).",
						"guides": [
							"El PIN corresponde a cada uno de los números que se encuentran en la sección Fichas del tapete electrónico (A)",
							"Junto con el tapete electrónico vienen 4 containers, los cuales son pequeñas cajas en las que se insertan las fichas para poder desarrollar una actividad (B).",
							"Al colocar los containers con sus respectivas fichas en el tapete electrónico debe tener en cuenta el PIN (número) en donde se encuentra la ficha que corresponde a la respuesta correcta, ya que ese PIN debe configurarse en ConectionRug.",
							"En la sección de fichas del tapete electrónico ubicar cada uno de los containers teniendo en cuenta el PIN (C).",
							"Tras haber iniciado la actividad a desarrollar y haber ubicado los containers con sus respectivas fichas correspondientes a la actividad debe ubicar la ficha correcta, validar el PIN en el cual se encuentra y configurarlo en la opción PIN de ConectionRug y luego dar clic en el botón Conectar (D)."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "CONEXIÓN/DESCONEXIÓN DE TAPETE",
						"id": "3.5.5",
						"route": "No Aplica",
						"reference": "estConnectRug",
						"includes": ["3.5.1"],
						"image": "![IMAGEN CONEXIÓN/DESCONEXIÓN DE TAPETE](/img/help/3.5.5.png)",
						"description": "Conexión del tapete electrónico.",
						"guides": [
							"Para hacer la conexión del tapete electrónico debe conectar el cable USB del tapete al puerto USB del computador.",
							"Seleccionar el PIN correcto en las lista desplegable PIN (Ver: UBICACIÓN DE FICHAS (Concordancia PIN-FICHA)) (A)",
							"Dar clic en el botón Conectar (B).",
							"Esperar a que es sistema realice la conexión, cuando el ícono de conexión se encuentre en color verde, significa que ya el tapete se encuentra conectado.",
							"Para desconectar el tapete dar clic en el botón Desconectar (C)."
						],
						"warnings": [
							"Verifique el tapete se encuentre bien conectado al computador."
						]
					},
					{
						"name": "GUÍA DOCENTE",
						"id": "3.5.6",
						"route": "No Aplica",
						"reference": "estGuideTeacher",
						"includes": ["3.3.3"],
						"image": "![IMAGEN GUÍA DOCENTE](/img/help/3.5.6.png)",
						"description": "Descripción de la Guía de los Docentes.",
						"guides": [
							"La guía de los docentes contiene los pasos para la realización de la actividad que se inició.",
							"Ubique visualmente la sección Guía.",
							"Allí puede leer cada uno de los pasos que debe tener en cuenta para el desarrollo correcto de la actividad."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "GUÍA NIÑOS/AS",
						"id": "3.5.7",
						"route": "No Aplica",
						"reference": "estGuideTeacher",
						"includes": ["3.3.3"],
						"image": "![IMAGEN GUÍA NIÑOS/AS](/img/help/3.5.7.png)",
						"description": "Descripción de la Guía de los Niños/as.",
						"guides": [
							"La guía de los/las niños/as contiene los pasos para la realización de la actividad que se inició.",
							"Ubique visualmente la sección ¡LÉEME!.",
							"Allí se pueden leer cada uno de los pasos o indicaciones que se le deben dar al/la niño/a para el desarrollo correcto de la actividad.",
							"Para que el sistema lea esta guía y pueda ser escuchada por los/las niños/as debe dar clic en el ícono Reproducir que se encuentra debajo de ¡LÉEME! (A)."
						],
						"warnings": [
							"No Aplica."
						]
					},
					{
						"name": "IMÁGENES",
						"id": "3.5.8",
						"route": "No Aplica",
						"reference": "estImagesActivity",
						"includes": ["3.3.3"],
						"image": "![IMAGEN IMÁGENES](/img/help/3.5.8.png)",
						"description": "Imágenes en la sección ¡ESCÚCHAME!.",
						"guides": [
							"Las imágenes que se muestran en la sección ¡ESCÚCHAME! se cargan dependiendo de cada actividad.",
							"Pueden ser desde 1 hasta 3 imágenes las mostradas en esta sección (A).",
							"Dependiendo de la actividad, junto a la imagen puede aparecer un ícono de reproducción de audio requerido para el desarrollo de la actividad, al dar clic en el sonará una canción o un cuento dependiendo de la actividad. (B)",
							"Al pasar el cursor sobre cada imagen esta agranda su tamaño (C).",
							"Al dar clic sobre cada imagen el sistema lee su descripción y dependiendo de cada actividad oculta o muestra dicha imagen."
						],
						"warnings": [
							"Siempre antes de iniciar a desarrollar una actividad, lea la Guía del Docente."
						]
					},
					{
						"name": "RESPUESTA",
						"id": "3.5.9",
						"route": "No Aplica",
						"reference": "estAnswerActivity",
						"includes": ["3.3.3"],
						"image": "![IMAGEN RESPUESTA](/img/help/3.5.9.png)",
						"description": "Respuesta del software al desarrollar una actividad.",
						"guides": [
							"Tras realizar una actividad sólo existen dos posibles resultados.",
							"Que el niño presione la ficha correcta:.",
							"Al presionarse la ficha correcta el tapete se ilumina, muestra un mensaje que dice '¡Muy Bien!' y se despliega una sección en el software que muestra una imagen de una carita feliz y un campo con la puntuación obtenida que para este caso es 10.",
							"Que el niño presione la ficha incorrecta:.",
							"Al presionarse una ficha incorrecta el tapete no se ilumina, muestra un mensaje que dice 'Sigue Intentando' y se despliega una sección en el software que muestra una imagen de una carita apenada y un campo con la puntuación obtenida que para este caso es 5."
						],
						"warnings": [
							"Verifique la correcta conexión del tapete."
						]
					}
				]
			}
		}
	}
}
