<?php

/**
 * Controlador para las configuraciones asociadas a los niveles de actividades económicas.
 *
 * @author Ing. Dainier Velázquez Labrada.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses ConfignivelesactividadeseconomicasController
 * @copyright UCID
 * @version 1.0
 */
class ConfignivelesactividadeseconomicasController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de los niveles de actividades económicas.
     */
    public function confignivelesactividadeseconomicasAction()
    {
        //Agregando a la vista los ficheros js de la ayuda.
        //  $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        // $this->view->idioma = $this->global->Perfil->idioma;

        //Obteniendo los niveles de actividades economicas (servicio de Contabilidad)
        $this->view->scriptelemgastoUI = $this->integrator->contabilidad->dir_CmpCentrosCostosUI();
        $this->view->scriptelemgastoClass = $this->integrator->contabilidad->dir_CmpCentroCostosClass();

        //Mostrando la vista.
        $this->render();
    }

    public function obtenerTiposDeNominasAction()
    {
        $arrayfinal = array();
        $modeloNegocioTipoN = new NomTipoNominaModel();
        //Obteniendo el listado de tipos de nómina.
        $arrTiposN = $modeloNegocioTipoN->obtenerListadoTiposNomina(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );
        $cont = 0;
        foreach ($arrTiposN as $nomina) {
            $arrayfinal[$cont]['idtiponomina'] = $nomina['idtiponomina'];
            $arrayfinal[$cont]['denominacion'] = $nomina['denominacion'];
            $cont++;
        }
        //Imprimiendo el listado de tipos de nómina.
        echo Zend_Json::encode(array('datos' => $arrayfinal, 'cantidad' => count($arrayfinal)));
    }

    public function obtenerConfiguracionNivelesAEAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $arrayfinal = array();
        $modeloNegocioNAE = new ConfigNivelActividadEconomicaModel();
        //Obteniendo el listado de tipos de nómina.
        $arrNivelesAE = $modeloNegocioNAE->obtenerListadoNivelesActividadEconomica($idestructura, $this->_getParam('start', 0), $this->_getParam('limit', 10)
        );
        $cont = 0;
        foreach ($arrNivelesAE as $nivelae) {
            //Obteniendo la denominación del tipo de nómina
            $sql = "select denominacion from mod_nomina.nom_tiponomina where idtiponomina = ? ";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $tiponomina = $conn->fetchAll($sql, array($nivelae['idtiponomina']));

            $nivelactividadeconomica = $this->integrator->contabilidad_costos->obtenerCentroNivelPorId($nivelae['idcentrogrupo']);

            //Valores del array
            $arrayfinal[$cont]['idconfiguracionnivelae'] = $nivelae['idnivelactiveconom'];
            $arrayfinal[$cont]['idtiponomina'] = $nivelae['idtiponomina'];
            $arrayfinal[$cont]['idnivelactividadeconomica'] = $nivelae['idcentrogrupo'];
            $arrayfinal[$cont]['tiponomina'] = $tiponomina[0]['denominacion'];
            $arrayfinal[$cont]['nivelactividadeconomica'] = $nivelactividadeconomica['descripcioncentrogrupo'];
            $cont++;
        }
        //Imprimiendo el listado de la configuración de niveles de actividades económicas
        echo Zend_Json::encode(array('datos' => $arrayfinal, 'cantidad' => count($arrayfinal)));
    }

    public function adicionarTipoNyNivelAEAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $idnivelactiveconom = $this->_request->getPost('idnivelactiveconom');
        $objDomain = new ConfigNivelActividadEconomicaModel();
        $add = $objDomain->adicionarNivelActividadEconomica($idestructura, $idtiponomina, $idnivelactiveconom);
        echo json_encode($add);
    }

    public function modificarTipoNyNivelAEAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idconfiguracionnivelae = $this->_request->getPost('idconfiguracionnivelae');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $idnivelactiveconom = $this->_request->getPost('idnivelactiveconom');

        $objDomain = new ConfigNivelActividadEconomicaModel();
        $mod = $objDomain->modificarNivelActividadEconomica($idconfiguracionnivelae, $idestructura, $idtiponomina, $idnivelactiveconom);
        echo json_encode($mod);
    }

    public function eliminarTipoNyNivelAEAction()
    {
        $idconfiguracionnivelae = $this->_request->getPost('idconfiguracionnivelae');
        $objDomain = new ConfigNivelActividadEconomicaModel();
        $resp = $objDomain->eliminarNivelActividadEconomica($idconfiguracionnivelae);
        echo json_encode($resp);
    }
}

