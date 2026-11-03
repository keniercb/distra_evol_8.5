<?php

class ReccomplejasService extends ZendExt_Model
{

    /**
     * Servicio que permite modificar el aviso asociado a una busqueda.
     *
     * @param array $parametros
     *
     * @return boolean
     */
    public function actualizaAvisoBusqueda($parametros)
    {
        $objRecuperacionesModel = new RecuperacionesModel();
        return $objRecuperacionesModel->actualizaAvisoBusqueda($parametros);
    }

    /**
     * Servicio que devuelve los scripts con las clases js que intervienen en la funcionalidad
     * de Recuperaciones complejas
     *
     * @param boolean $useMap Para inluir los js que se necesitan para usar lo Mapas.
     *
     * @return String
     */
        public function obtenerScriptsReccomplejas($useMap = 0)
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        //Script para usar la ayuda

//        if($useMap){
//          $dirScripts .= $this->integrator->representacion->DevolverJS();
//          $dirScripts .= '<script type="text/javascript" src="/reccomplejas/views/js/reccomplejas/mapView.js"></script>';
////        $dirScripts .= '<script type="text/javascript" src="/reccomplejas/views/js/reccomplejas/classMapa.js"></script>';
//        }

        $dirScripts .= file_get_contents($dirApps . '/reccomplejas/views/scripts/reccomplejas/reccomplejas.phtml');

        //$dirScriptsEditarAviso = $this->integrator->notification->obtenerScriptsVentanaEditarAviso();
        /*
          //Recoje las direcciones de la funcionalidad de Gestionar Avisos y se adicionan al arreglo de scripts
          foreach($dirScriptsEditarAviso as $script){
          $dir = '<script type="text/javascript" src="'.$script.'"></script>';
          $dirScripts .= $dir;
          }
         */
        //print_r();die;
        return $dirScripts;
    }

    public function getBusquedasByUserConf($idconfiguracion, $idusuario)
    {
        $objDatBusquedaModel = new DatBusquedaModel();
        $arrBusquedas = $objDatBusquedaModel->getBusquedasByUserConf($idconfiguracion, $idusuario);
        return $arrBusquedas;
    }

    public function getSqlBusqueda($idconfiguracion, $idbusqueda)
    {
        $objRecuperacionesModel = new RecuperacionesModel();
        return $objRecuperacionesModel->getSqlBusqueda($idconfiguracion, $idbusqueda);
    }

    /**
     * Metodo que devuelve los scripts necesarios para utilizar la libreria para graficar
     *
     * @return string
     */
    public function getScriptsForCharting()
    {
        $scripts
            = '<script type="text/javascript" src="/reccomplejas/views/idioma/es/highcharts/highcharts.js"></script>';
        $scripts
            .= '<script type="text/javascript" src="/reccomplejas/views/js/highcharts/jquery.min.js"></script>';
        $scripts
            .= '<script type="text/javascript" src="/reccomplejas/views/js/highcharts/highcharts.src.js"></script>';
        $scripts
            .= '<script type="text/javascript" src="/reccomplejas/views/js/highcharts/modules/exporting.src.js">
            </script>';
        return $scripts;
    }

    public function obtenerConfiguraciones($denom, $limit, $start)
    {
        $configModel = new NomConfiguracion();
        $datos['datos'] = $configModel->GetPorLimite($denom, $limit, $start);
        $datos['cantidad'] = $configModel->GetCantTotal($denom);
        return $datos;
    }

    /**
     * Devuelve todos los campos de la configuracion en forma de listado
     *
     * @param $idconfiguracion
     *
     * @return mixed
     */
    public function getCamposConfiguracion($idconfiguracion)
    {
        //Cambio realizado puesto que habia solapamiento de clases con Metadato
        //Fecha: 25/01/2014
        include_once('models/domain/DatCampo.php');
        $objCampo = new DatCampo();
        $result = $objCampo->getCamposConfiguracion($idconfiguracion);
        return $result;
    }

    /**
     * Obtiene los nodos de la configuracion para ser representados en forma de arbol
     *
     * @param $idconfiguracion
     * @param $idpadre
     *
     * @return array
     */
    public function getFieldsForTree($idconfiguracion, $idpadre)
    {
        require('models/domain/DatCampo.php');
        $objCampo = new DatCampo();
        return $objCampo->getCampos($idconfiguracion, $idpadre);
    }

    public function addDqlDatCampo(
        $idconfiguracion, $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect
    )
    {
        require('models/domain/generated/BaseDatCampo.php');
        require('models/domain/DatCampo.php');

        $objCampo = new DatCampo();
        return $objCampo->addDqlDatCampo(
            $idconfiguracion, $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect
        );
    }

    public function obtenerReporte($idconfiguracion, $condiciones, $orden = array(), $limit = 25, $start = 0)
    {
        try {
            $objModel = new RecuperacionesModel();
            return $objModel->obtenerReporteInicial($idconfiguracion, $condiciones, $orden, $limit, $start);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Ejecuta un busqueda
     * @param $idconfiguracion
     * @param array $campos
     * @param array $condiciones
     * @param array $orderby
     * @param array $operacion
     * @param int $limit
     * @param int $start
     * @param null $extraParams
     * @throws Exception
     */
    public function buscar(
        $idconfiguracion, $campos = array(), $condiciones = array(), $orderby = array(), $operacion = array(),
        $limit = 25, $start = 0, $extraParams = null)
    {
        try {
            $objRecuperacionesModel = new RecuperacionesModel();
            $objRecuperacionesModel->generaSQLs(
                $idconfiguracion, $campos, $condiciones, $orderby, $operacion, $limit, $start, $extraParams
            );
            return $objRecuperacionesModel->ejecutarSQL();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function ejecutarBusquedaAvanzada($idbusqueda,$idusuario = false ,$limit = 18 ,$start=0)
    {
		try {
            $objRecuperacionesModel = new RecuperacionesModel();
            $result = $objRecuperacionesModel->obtenerServicioBusqueda($idbusqueda);
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }
}