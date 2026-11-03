<?php
	/**
	 *  ZendExt_Controller_Secure
	 *
	 * Controlador de acciones personalizado e integrado a seguridad
	 *
	 * @author Omar Antonio Diaz Peña
	 * @package ZendExt
	 * @subpackage ZendExt_Controller
	 * @copyright UCID-ERP Cuba
	 * @version 1.0-0
	 */
	class ZendExt_Controller_Secure extends Zend_Controller_Action
	{
		/**
		 * Conexion a la BD
		 *
		 * @var Doctrine_Conexion
		 */
		protected $conn;

		/**
		 * Nomencladores cargados
		 *
		 * @var array of ZendExt_FastResponse_NomLoader
		 */
		protected $nomencladores;

		/**
		 * init
		 *
		 * Inicializa el controlador
		 *
		 * @return void
		 */
		public function init ()
		{
			//Para quitar lo de la pagina en blanco.
			$this->_helper->viewRenderer->setNoRender(true);
			$this->_helper->removeHelper('viewRenderer');
			Zend_Controller_Front::getInstance()->setParam('noViewRenderer', true);

			//Obtengo una instancia del registro.
			$registro = Zend_Registry::getInstance();

			//Obtengo la conexion activa que esta almacenada en el registro
			$this->conn = $registro->conexion;

			//Obtengo el idioma
			$perfil = $this->getPerfil();
			$idioma = $perfil['idioma'];

			//Obteniendo la direccion de ExtJS y UCID
			$this->view->dir_extjs = $registro->config->idioma->$idioma->extjs_path;
			$this->view->dir_ucid = $registro->config->ucid_path;

			//Determinando si un usuario tiene acceso a una accion determinada.
			$currentAction = $this->_request->getActionName();
			$currentController = $this->_request->getControllerName();

			//Verificar si esta accion se esta validando y si es asi ejecutar los metodos validadores...;
			$aplicationName = $registro->config->module_name;

			$validacion = new ZendExt_Validation();
			$validacion->ValidateAction($aplicationName,$currentController,$currentAction);


			$session = new Zend_Session_Namespace ('ERP');
			$certificado = $session->certificado;

			//el ultimo parametro es para pasarle los campos de busqueda para formar el where de la consulta a ejecutar
			$this->nomencladores = ZendExt_FastResponse::getNomsByAction($currentController, $currentAction, $this->_request->getPost());
		}

		/**
		 * getPerfil
		 *
		 * Obtiene el perfil del usuario
		 *
		 * @throws ZendExt_Exception - dispara excepcion declarada en el xml de excepciones
		 * @return array - devuelve los datos del usuario y de su perfil
		 */
		public function getPerfil()
		{
			$registro = Zend_Registry::getInstance();
			return $registro->session->perfil;
		}

		/**
		 * cargaretiquetasAction
		 *
		 * Imprime las etiquetas para una vista en formato json
		 *
		 * @throws ZendExt_Exception - dispara excepcion declarada en el xml de excepciones
		 * @return void
		 */
		public function cargaretiquetasAction()
		{
			$controller = $this->_request->getControllerName();
			$vista = $this->_request->getPost('vista');
			if (!$vista)
				$vista = $controller;
			$perfil = $this->getPerfil();

			$file = "views/idioma/{$perfil['idioma']}/$controller/$vista.json";
			if (file_exists($file))
			{
				if (is_readable($file))
					echo file_get_contents($file);
				else
					throw new ZendExt_Exception('E011');
			}
			else
				throw new ZendExt_Exception('E010');
		}

		/**
		 * showMessage
		 *
		 * Imprime un mensaje en formato json
		 *
		 * @param string $msg - mensaje
		 * @return void
		 */
		protected function showMessage($msg)
		{
			die("{'codMsg':1,'mensaje': '$msg'}");
		}

		/**
                * Imprime un mensaje de error en formato json
                *
                * @param string $msg - mensaje
                * @return void
                */
                protected function showErrorMessage($msg) {
                   echo "{'codMsg':6,'mensaje': '$msg'}";
                }

		/**
		 * closeportalAction
		 *
		 * Cierra la session del usuario al salir del portal
		 *
		 * @return void
		 */
		public function closeportalAction()
		{
			$registro = Zend_Registry::getInstance();
			$registro->session->unsetAll();
			$registro->session->close = true;
			die(json_encode(array('close'=>true)));
		}
	}
