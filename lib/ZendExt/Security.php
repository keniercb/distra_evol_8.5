<?php
	/**
	 * Interfaz para interactuar con el SIGES para gestionar la seguridad y los
	 * procesos de autenticacion, autorizacion, auditoria y administracion de perfiles
	 * 
	 * @package ZendExt
	 * @copyright UCID-ERP Cuba
	 * @author Omar Antonio Diaz Peña	 
	 * @version 1.0-0
	 */
	class ZendExt_Security
	{
		/**
		 * Cliente de SOAP para utilizar los servicios web que brinda el SIGES
		 * 
		 * @var SoapClient
		 */
		private $soapClient;
		
		/** 
		 * HasAccess
		 * 
		 * Verifica a partir de un certificado si un un usuario tiene acceso a una accion.
		 * 
		 * @param $pController - nombre del controlador
		 * @param $pAction - nombre de la accion
		 * @param $pCertificate - certificado emitido por el SIGES
		 * @return boolean - devuelve true si tiene acceso, false si no
		 * @throws ZendExt_Exception - Excepcion declara en el xml de excepciones
		 * @ignore function HasAccess - pendiente a implementacion
		 */
		public function HasAccess ($pController, $pAction, $pCertificate)
		{
			return true;
		}
		
		/** 
		 * Login
		 * 
		 * Control de acceso al sistema.
		 * 
		 * @param $pUser - nombre o alias del usuario que se registro
		 * @param $pPass - clave de acceso del usuario
		 * @param $pIdSistema - identificador del sistema
		 * @return string - devuelve el certificado asignado al usuario
		 * @throws ZendExt_Exception - Excepcion declara en el xml de excepciones
		 * @ignore return - retorna 1, pendiente a utilizacion
		 */
		public function Login ($pUser, $pPass, $pIdSistema)
		{
			return 1;
			try 
			{
				//Se solicita el servicio de autenticacion
				$result = $this->soapClient->Autenticar (base64_encode($pUser), base64_encode($pPass), base64_encode($pIdSistema));			      
				return $result;
			}	
			catch (SoapFault $e) //Si se captura una excepcion de SOAP
			{
				//Se dispara una excepcion declarada en el xml de excepciones
				throw new ZendExt_Exception ('S001');
			}
		}
		
		/** 
		 * ZendExt_Security
		 * 
		 * Constructor de la clase, crea una instancia del cliente de SOAP
		 * para utilizar los servicios web que brinda el SIGES
		 * 
		 * @return string - devuelve el certificado asignado al usuario
		 * @throws ZendExt_Exception - Excepcion declara en el xml de excepciones
		 * @ignore function ZendExt_Security - no hace nada pendiente a utilizacion
		 */
		public function ZendExt_Security()
		{
			/*
			//Se obtiene el obejto de configuracion del seguridad.
			$seguridadInstance = Zend_Registry::get('config')->seguridad;
			try
			{
				//Se crea la instancia del cliente de SOAP
				$this->soapClient = new SoapClient(null, array('location' => $seguridadInstance->location, 'uri' => $seguridadInstance->uri));
			}
			catch (SoapFault $e) //Si se captura una excepcion de SOAP
			{
				try //Se intenta crear la instancia de otra forma
				{
					//Se crea la instancia del cliente de SOAP
					$this->soapClient = new SoapClient($seguridadInstance->wsdl);
				}				
				catch (SoapFault $e) //Si se captura una excepcion de SOAP
				{
					//Se dispara una excepcion declarada en el xml de excepciones
					throw new ZendExt_Exception('S002',$e);
				}
			}
			*/
		}
		
	}
