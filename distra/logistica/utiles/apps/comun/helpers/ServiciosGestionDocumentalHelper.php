<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ServiciosGestionDocumentalHelper
 *
 * @author kenier
 */
class ServiciosGestionDocumentalHelper implements ISingletonClass
{

    public static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ServiciosGestionDocumentalHelper;
        }
        return self::$instance;
    }

    /**
     * Una instancia unica de ServiciosGestionDocumentalHelper
     *
     * @var ServiciosGestionDocumentalHelper
     */
    private static $instance = null;

    /**
     * Variables internas de la clase
     *
     */
    private $integrator = null;
    private $varglobal = null;

    /**
     * Inicializando las variables
     *
     */
    private function __construct()
    {
        $this->integrator = ZendExt_IoC::getInstance();
        $this->varglobal = ZendExt_GlobalConcept::getInstance();
    }
  
    /**
	permite incluir los script necesarios para la gestión documental del lado del cliente
	@return string
	*/
	
    public function devolverJSContenido()
    {
        try {
            return $this->integrator->gestordocumental->devolverJSContenido();
        } catch (Exception $e) {
        }
    }
	
	 /**
	permite adicionar un espacio de trabajo
	@param $identificadorpadre(string), $nombre(string), $descripcion(string)
	@return array
	*/
	
    public function adicionarEspacioTrabajo($identificadorpadre, $nombre, $descripcion)
    {
        try {
            return $this->integrator->gestordocumental->adicionarEspacioTrabajo($identificadorpadre, $nombre, $descripcion);
        } catch (Exception $e) {
        }
    }
	
	 /**
	permite obtener los documentos
	@param $identificadorNodo(string)
	@return array
	*/
	
    public function obtenerBase64Documento($identificadorNodo)
    {
        try {
            return $this->integrator->gestordocumental->obtenerBase64Documento($identificadorNodo);
        } catch (Exception $e) {
        }
    }
	
	/**
	permite obtener la utenticacion
	@param $user(string),$pass
	@return array
	*/
	
    public function obtenerAutenticacion($user,$pass)
    {
        try {
            return $this->integrator->gestordocumental->obtenerAutenticacion($user,$pass);
        } catch (Exception $e) {
        }
    }
	
	/**
	permite obtener los contenidos
	@param $parametros
	@return array
	*/
	
    public function obtenerContenidos($parametros)
    {
        try {
            return $this->integrator->gestordocumental->obtenerContenidos($parametros);
        } catch (Exception $e) {
        }
    }
	
	/**
	Elimina un elemento de contenido del sistema (Espacios de trabajo o
    documento)
	@param $contenidos, $eliminarEspacioActual
	@return array
	*/
	
    public function  eliminarElementosContenido($contenidos, $eliminarEspacioActual)
    {
        try {
            return $this->integrator->gestordocumental->eliminarElementosContenido($contenidos, $eliminarEspacioActual);
        } catch (Exception $e) {
        }
    }
	
	/**
	Modificar el espacio
	@param $identificadorNodo, $nombre, $descripcion
	@return array
	*/
	
    public function  modificarEspacio($identificadorNodo, $nombre, $descripcion)
    {
        try {
            return $this->integrator->gestordocumental->modificarEspacio($identificadorNodo, $nombre, $descripcion);
        } catch (Exception $e) {
        }
    }
	/**
	Modificar el Documento
	@param $identificadorNodo, $descripcion, $paramPropiedadesTipoDocumento,$nombre
	@return array
	*/
	
    public function modificarDocumento($identificadorNodo, $descripcion, $paramPropiedadesTipoDocumento,$nombre)
    {
        try {
            return $this->integrator->gestordocumental->modificarDocumento($identificadorNodo, $descripcion, $paramPropiedadesTipoDocumento,$nombre);
        } catch (Exception $e) {
        }
    }
	
	/**
	Modificar el Documento
	@param $identificadorNodo, $descripcion, $paramTipoDocumento, $paramPropiedadesTipoDocumento, $Fichero, $nombreDocumento
	@return array
	*/
	
    public function adicionarDocumento($identificadorNodo, $descripcion, $paramTipoDocumento, $paramPropiedadesTipoDocumento, $Fichero, $nombreDocumento)
    {
        try {
            return $this->integrator->gestordocumental->adicionarDocumento($identificadorNodo, $descripcion, $paramTipoDocumento, $paramPropiedadesTipoDocumento, $Fichero, $nombreDocumento);
        } catch (Exception $e) {
        }
    }
    
    /**
     * Elimina un elemento de contenido del sistema (Espacios de trabajo o
     * documento)
     *
     * @param array $_POST
     *            - Datos enviados del cliente
     *
     * @return json
     */
    public function eliminarDocumento($identificadorNodos, $mode = 'total')
    {
        try {
            return $this->integrator->gestordocumental->eliminarElementosContenido($identificadorNodos, $mode);
        } catch (Exception $e) {
            
        }
    }

//put your code here
}
