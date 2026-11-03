<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar retenciones.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses DatRetencionModel
 * @copyright UCID
 * @version 1.0
 */
class GestretencionController extends ZendExt_Controller_Secure
{


    /**
     * Inicializar los atributos de la clase.
     */
    
    public function init()
    {
        parent::init();
        $this->objNominaDatos = new DatNominaDatos();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de retenciones.
     */
    public function gestretencionAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->view->comprobante = $this->integrator->contabilidad->getComprobanteComponent();
        //Mostrando la vista.
        $this->render();
    }
    /**
     * Acciones utilizadas para mostrar la vista de listado de personas alta.
     */

    //funcion para obtener los datos de las personas
    public function obtenerDatosPersonaRetencionAction(){
        $modeloPersonaRetencion = new ConfPersonaRetencion();

        $arrPersonaRetencion = $modeloPersonaRetencion->obtenerDatosPersonaRetencion(
            $this->_getParam('identidad', 0),
            $this->_getParam('start', 0),
            $this->_getParam('limit', 25)
        );
        $cantTotalPersonas = $modeloPersonaRetencion-> obtenerCantidadDatosPersonaRetencion($this->_getParam('identidad', 0));
        echo Zend_Json::encode(array('datos' => $arrPersonaRetencion, 'cantidad' => $cantTotalPersonas));
    }

    //mostrar el listado de las personas con retenciones
    public function obtenerListadoPersonasRetencionAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $texto = $this->_getParam('texto');
        $inicio = $this->_getParam('start');
        $limite = $this->_getParam('limit');

        $objConfPersonaRetencion = new ConfPersonaRetencion();
        $personasretencion = $objConfPersonaRetencion->obtenerDatosPersonaRetencion($identidad, $texto, $inicio, $limite );
        //orden de las personas por plantillas nominales
        foreach ($personasretencion as $p => $persona) {
            $nombreplantilla = (!empty($persona['plantillanominal'])) ? $persona['plantillanominal'] : 'Sin plantilla nominal';
            if ($nombreplantilla != 'Sin plantilla nominal') {
                list($ordenplantilla,) = explode('-', $persona['plantillanominal']);
                $longorden = strlen($ordenplantilla . '');
                $personasretencion[$p]['plantillanominal'] = chr(96 + $longorden) . $persona['plantillanominal'];//chr(96) caracter antes de letra "a"
            } else {
                $personasretencion[$p]['plantillanominal'] = 'z-' . $nombreplantilla;
            }
        }
        $cantidadpersonaretencion =  $objConfPersonaRetencion->obtenerCantidadDatosPersonaRetencion($identidad , $texto); 
        echo json_encode(array('datos' => $personasretencion, 'cantidad' => $cantidadpersonaretencion));
        
    }

    //funcion para adicionar persona al listado de retenciones
    public function adicionarPersonasRetencionesEntidadAction(){
        $mensaje = "ok";$arrpersonasexiste = array();$contarr = 0;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $identidad = $this->_request->getPost('identidad');
        $arrayidpersona = Zend_Json::decode(stripslashes($this->_getParam('arrayidpersona')));
        foreach ($arrayidpersona as $i => $value) {
            //comprobar si la o las personas seleccionadas existen ya en el listado de personas con retenciones
            $existe = ConfPersonaRetencion::existeRetencionPersona($value, $identidad);
            if ($existe == 0) {
                //almasenar los datos de las personas si no existe
                $objConfRetencion = new ConfPersonaRetencion();
                $objConfRetencion->idpersona = $value;
                $objConfRetencion->identidad = $identidad;
                $objConfRetencion->save();
            }else{               
                $arrpersonasexiste[$contarr] = $value;//almasenar las personas si existe
                $mensaje = "nook";
                $contarr++;
            }
        }
        $nombrespersonas = "";       
        foreach($arrpersonasexiste as $idpers){
            $sql = "SELECT nombre ||' '|| snombre ||' '|| papel ||' '|| sapel as nombreyapellidos
                    FROM mod_persona.dat_persona where idpersona = ?;";
             //obtener los datos de las personas si existe       
            $datospersona = $conn->fetchAll($sql, array($idpers));
            //guadando en un arreglo los datos de las personas si existe 
            if($nombrespersonas == ""){
                $nombrespersonas = $datospersona[0]['nombreyapellidos'];
            }else{
                $nombrespersonas = $nombrespersonas . ", " . $datospersona[0]['nombreyapellidos'];
            }            
        }
        //guardar la respuesta en el mensaje del obj objrespuesta
        $objrespuesta->mensaje = $mensaje;
        if($mensaje == "nook"){
            $objrespuesta->nombrespersonas = $nombrespersonas;       
         }     
        echo json_encode($objrespuesta);   
    }
     /************* Borrar personas del listado del submayor si no tienen operaciones, borrar ajustes **************************/
    public function eliminarPersonasRetencionAction()
    {
        $mensaje = 'ok';
        $identidad = $this->_request->getPost('identidad');
        $arrelementos = Zend_Json::decode(stripslashes($this->_getParam('arrelementos')));
        $arrypersonas = Zend_Json::decode(stripslashes($this->_getParam('arrypersonas')));
        //Recorriendo las personas
        foreach ($arrelementos as $i => $re) {  
            //eliminar la persona del listado de retenciones 
            $objConfRetencionesDelete = Doctrine::getTable('ConfPersonaRetencion')->find($re);
            $objConfRetencionesDelete->delete();  
        }
        echo json_encode($mensaje);
    }
     /************* Validar si las personas del listado del submayor tienen operaciones **************************/
    public function validarEliminarPersonasRetencionAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $arrypersonas = Zend_Json::decode(stripslashes($this->_getParam('arrypersonas')));
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $nombrespersonas = '';
        //Recorriendo las personas para validar si tienen operaciones
        foreach ($arrypersonas as $ridpers) {
            $sql = "select count(dr.idretencionpersona)
            from  mod_nomina.dat_retencionpersona dr
            where dr.idpersona = ? and dr.identidad = ?";
            $cantidadop = $conn->fetchOne($sql, array($ridpers, $identidad));
            if ($cantidadop > 0) {
                $sqlDatosPersona = "select CONCAT(dp.nombre,' ',dp.snombre, ' ',dp.papel, ' ',dp.sapel) as nombreapp from mod_persona.dat_persona dp
                                where dp.idpersona = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $persona = $conn->fetchOne($sqlDatosPersona, array($ridpers));
                $nombrespersonas = ($nombrespersonas == '') ? $persona : $nombrespersonas . ', ' . $persona;
            }
        }
        $respuesta = new stdClass();
        $respuesta->nombrespersona = $nombrespersonas;
        //Si hay personas con operaciones
        if ($nombrespersonas == '') {
        $respuesta->codigo = 'noexistenretenciones';
        } else {
        $respuesta->codigo = 'existenretenciones';
        }
        echo json_encode($respuesta);
    }
    /**
     * Accion utilizada para listar las personas de baja en el submayor de retenciones en la entidad.
     */
    public function obtenerListadoPersonasRetencionBajaAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $texto = $this->_getParam('texto');
        $inicio = $this->_getParam('start');
        $limite = $this->_getParam('limit');

        $objHisPersonaBaja = new HisDatRetencionPersona();
        $hispersonaretencionbaja = $objHisPersonaBaja->obtenerDatosPersonaRetencionBaja($identidad, $texto, $inicio, $limite);
        //orden de las personas por plantillas nominales
        foreach ($hispersonaretencionbaja as $p => $persona) {
            $idpersona = $persona['idpersona'];
            $sqlplantillas = "select DISTINCT (CASE WHEN cpn.denominacion <> '' THEN cpn.orden || '-' || cpn.denominacion ELSE 'Sin plantilla nominal' END) as area
                from mod_persona.dat_persona dp
                left join mod_persona.dat_docidentidad ddi on (ddi.idpersona = dp.idpersona)
                inner join mod_nomina.his_personabaja hpb on (hpb.idpersona = dp.idpersona)
                inner join mod_nomina.his_vacacionespersonabaja hvpb on (hvpb.idpersonabaja = hpb.idpersonabaja)
                left join mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = hpb.idplantillanominal)
                where hpb.idpersona = $idpersona";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $datosplantillas = $conn->fetchOne($sqlplantillas);
            $persona['plantillanominal'] = $datosplantillas;

            $nombreplantilla = (!empty($persona['plantillanominal'])) ? $persona['plantillanominal'] : 'Sin plantilla nominal';
            if ($nombreplantilla != 'Sin plantilla nominal') {
                list($ordenplantilla,) = explode('-', $persona['plantillanominal']);
                $longorden = strlen($ordenplantilla . '');
                $hispersonaretencionbaja[$p]['plantillanominal'] = chr(96 + $longorden) . $persona['plantillanominal'];//chr(96) caracter antes de letra "a"
            } else {
                $hispersonaretencionbaja[$p]['plantillanominal'] = 'z-' . $nombreplantilla;
            }
        }
        $cantidadPerRetBaja = $objHisPersonaBaja->cantPersonaRetencionBaja($identidad);
        //$cantHisPersonaBaja = $objHisPersonaBaja->obtenerCantidadDatosRetencionesPersonaBaja($identidad, $texto);
        echo json_encode(array('datos' => $hispersonaretencionbaja, 'cantidad' => $cantidadPerRetBaja));
    }
    //funcion para obtener los datos de las personas
    public function obtenerDatosPersonaRetencionBajaAction(){
        $modeloHisDatPersonaRetencionBaja = new HisDatRetencionPersona();

        $arrPersonaRetencion = $modeloHisDatPersonaRetencionBaja->obtenerDatosPersonaRetencionBaja(
            $this->_getParam('identidad', 0),
            $this->_getParam('start', 0),
            $this->_getParam('limit', 25)
        );
    //$cantTotalPersonas = $modeloHisDatPersonaRetencionBaja-> obtenerCantidadDatosRetencionesPersonaBaja($this->_getParam('identidad', 0));
    echo Zend_Json::encode(array('datos' => $arrPersonaRetencion, 'cantidad' => count($arrPersonaRetencion)));
    }

    /**
     * Accion utilizada para listar las personas registradas en la entidad.
     */
    public function obtenerListadoPersonasAction()
    {

        //Creando el modelo de negocio de gestión de cargos ocupados.
        $modeloNegocioCargos = new DatCargosOcupadosModel();

        //Obteniendo el listado de personas.
        $arrPersonas = $modeloNegocioCargos->obtenerListadoPersonasRegistradas(
            $this->_getParam('identidad', 0),
            $this->_getParam('start', 0),
            $this->_getParam('limit', 25)
        );

        //Obteniendo la cantidad total de personas registradas.
        $cantTotalPersonas = $modeloNegocioCargos->obtenerCantidadTotalPersonasRegistradas($this->_getParam('identidad', 0));

        //Imprimiendo el listado de variables globales.
        echo Zend_Json::encode(array('datos' => $arrPersonas, 'cantidad' => $cantTotalPersonas));
    }

    /**
     * Accion utilizada para listar las retenciones asociadas a las personas.
     */
    public function obtenerListadoRetencionesAction()
    {
        //Estructura economica
        $idestructuraE = $this->global->EstructuraEconomica->idestructurae;
        //Creando el modelo de negocio de gestión de retenciones de las personas.
        $modeloNegocioRetenPer = new DatRetencionPersonaModel();

        //Obteniendo el listado de las retenciones de la persona.
        $arrRetenc = $modeloNegocioRetenPer->obtenerListadoRetencionesPersona(
            $this->_getParam('idpersona', 0),
            $this->_getParam('identidad', 0),
            $this->_getParam('start', 0),
            $this->_getParam('limit', 15)
        );
        foreach ($arrRetenc as $k => $v) {
            if($idestructuraE){
                if (!empty($v['idcuenta'])) {
                    $arrRetenc[$k]['cuentacontable'] = $v['idcuenta'];
                    $arrRetenc[$k]['denom'] = $this->integrator->contabilidad->obtenerCuentaPorId($v['idcuenta'])->text;
                }
            }
        }

        //Obteniendo la cantidad total de retenciones de persona registradas.
        $cantTotalRetenc = $modeloNegocioRetenPer->obtenerCantidadTotalRetencionesPersona(
            $this->_getParam('idpersona', 0),
            $this->_getParam('identidad', 0)
        );

        //Imprimiendo el listado de retenciones de persona.
        echo Zend_Json::encode(array('datos' => $arrRetenc, 'cantidad' => $cantTotalRetenc));

    }

    /**
     * Accion utilizada para listar las retenciones asociadas a las personas.
     */
    public function obtenerNomencladorRetencionesAction()/*obtenerNomencladorRetencionesAction*/
    {
        //Creando el modelo de negocio de gestión de retenciones de las personas.
        $NomTipoRetencion = new NomTipoRetencion();

        //Obteniendo el listado de las retenciones de la persona.
        $arrRetenc = $NomTipoRetencion->obtenerListadoTiposRetencion(

            $this->_getParam('start', 0),
            $this->_getParam('limit', 25)
        );
        //print_r($arrRetenc);die;

        //Obteniendo la cantidad total de retenciones de persona registradas.
        $cantTotalRetenc = $NomTipoRetencion->obtenerCantidadTotalTiposRetencion();

        //Imprimiendo el listado de retenciones de persona.
        echo Zend_Json::encode(array('datos' => $arrRetenc, 'cantidad' => $cantTotalRetenc));

    }

    /**
     * Accion utilizada para listar las operaciones de retenciones asociadas a las personas.
     */
    public function obtenerListadoRetencionesHistoricoAction()
    {
        $modeloNegocioRetenPer = new HisRetencionesPersona();
        $arrRetenc = $modeloNegocioRetenPer->obtenerHistoricoSubMayorRetenciones(
            $this->_getParam('idretencionpersona'),
            $this->_getParam('limit'),
            $this->_getParam('start')
        );
        $cantTotalRetenc = $modeloNegocioRetenPer->obtenerCantidadHistoricoSubMayorRetenciones(
            $this->_getParam('idretencionpersona')
        );
        //Imprimiendo el listado de retenciones de persona.
        echo Zend_Json::encode(array('datos' => $arrRetenc, 'cantidad' => count($cantTotalRetenc)));

    }

    /**
     * Accion utilizada para listar el historico de las retenciones asociadas a las personas.
     */
    public function obtenerHistoricoListadoRetencionesAction()
    {
        //Creando el modelo de negocio de gestión de retenciones de las personas.
        $modeloNegocioRetenPer = new DatRetencionPersonaModel();

        //Obteniendo el listado de las retenciones de la persona.
        $arrRetenc = $modeloNegocioRetenPer->obtenerHistoricoListadoRetencionesPersona(
            $this->_getParam('idpersona', 0),
            $this->_getParam('identidad', 0),
            $this->_getParam('start', 0),
            $this->_getParam('limit', 25)
        );

        //Obteniendo la cantidad total de retenciones de persona registradas.
        $cantTotalRetenc = count($arrRetenc);

        //Imprimiendo el listado de retenciones de persona.
        echo Zend_Json::encode(array('datos' => $arrRetenc, 'cantidad' => $cantTotalRetenc));

    }

    /**
     * Historico de operaciones*/
    public function obtenerListadohistoricoOperacionesRetencionesAction()
    {
        $modeloNegocioRetenPer = new HisDatRetencionPersona();

        $arrRetenc = $modeloNegocioRetenPer->obtenerListadohistoricoOperacionesRetenciones(
            $this->_getParam('idhisdatretencionpersona'),
            $this->_getParam('limit', 20),
            $this->_getParam('start', 0)
        );

        $cantTotalRetenc = count($arrRetenc);

        //Imprimiendo el listado de retenciones de persona.
        echo Zend_Json::encode(array('datos' => $arrRetenc, 'cantidad' => $cantTotalRetenc));

    }

    /**
     * Accion utilizada para listar los tipos de retenciones.
     */
    public function obtenerTiposRetencionesAction()
    {
        ///Creando el modelo de negocio de gestión de tipos de retenciones.
        $modeloNegocioTipoR = new NomTipoRetencionModel();

        //Obteniendo el listado de tipos de retenciones.
        $arrTipoR = $modeloNegocioTipoR->obtenerTodosTiposRetenciones();

        //Imprimiendo el listado de tipos de retenciones.
        echo Zend_Json::encode(array('datos' => $arrTipoR, 'cantidad' => count($arrTipoR)));
    }

    /**
     * Accion para adicionar una retención.
     */
    public function adicionarRetencionPersonaAction()
    {

        //Creando el modelo de negocio de gestion de retenciones de personas.
        $modeloNegocioRetencPer = new DatRetencionPersonaModel();
        //Insertando los datos de la retención de la persona.
        $modeloNegocioRetencPer->adicionarRetencionPersona(
            $this->_getParam('tiporetenc'),
            $this->_getParam('idpersona'),
            $this->_getParam('identidad'),
            $this->_getParam('saldoinicial'),
            $this->_getParam('mensualidad'),
            $this->_getParam('ultmensualidad'),
            $this->_getParam('referencia'),
            $this->_getParam('fechadoc'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('activo'),
            $this->_getParam('cuentacontable')

        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codMsg':'1'}";
    }

    /**
     * Accion para modificar una retención.
     */
    public function modificarRetencionPersonaAction()
    {

        //Creando el modelo de negocio de gestion de retenciones de personas.
        $modeloNegocioRetencPer = new DatRetencionPersonaModel();

        //Modificando los datos de la retención de la persona.
        $modeloNegocioRetencPer->modificarRetencionPersona(
            $this->_getParam('idretencionpersona'),
            $this->_getParam('tiporetenc'),
            $this->_getParam('idpersona'),
            $this->_getParam('identidad'),
            $this->_getParam('saldoinicial'),
            $this->_getParam('mensualidad'),
            $this->_getParam('ultmensualidad'),
            $this->_getParam('referencia'),
            $this->_getParam('fechadoc'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('activo'),
            $this->_getParam('cuentacontable')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codMsg':'1'}";
    }

    /**
     * Accion para eliminar una retención.
     */
    public function eliminarRetencionPersonaAction()
    {
//print_r($this->_getParam('idretencionpersona'));die;
        //Creando el modelo de negocio de gestion de retenciones de personas.
        $modeloNegocioRetencPer = new DatRetencionPersonaModel();

        //Eliminando retención de la persona.
        $result = $modeloNegocioRetencPer->eliminarRetencionPersona(
            $this->_getParam('idretencionpersona')
        );

        if ($result == 1) {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codMsg':'1'}";
        } else if ($result == 2) {
            echo "{'codMsg':'2'}";
        }              
    }

    /*
     * Funcion para cuadrar el submayor por operaciones
     */

    public function cuadrarSubmayorxOperacionesAction()
    {
        $identidad = $this->_getParam('identidad');
        $this->cuadrarSubmayorxOperaciones($identidad);
        echo json_encode('ok');
    }
     
    public function cuadrarSubmayorxOperaciones($identidad)
    {
        
        $objNomTipoRetencion = new NomTipoRetencion();
        $objDatRetencionPersona = new DatRetencionPersona();
        $objHisRetencionPersona = new HisRetencionesPersona();
        //Todas las cargas iniciales de las retenciones
        $retencionespersonaentidad = $objDatRetencionPersona->obtenerRetencionesEntidad($identidad);
        if (count($retencionespersonaentidad) > 0) {
            foreach ($retencionespersonaentidad as $ret) {
                $idretencionpersona = $ret['idretencionpersona'];
                $saldoinicial = $ret['saldoinicial'];
                $saldolimite = $retencionespersonaentidad[0]['NomTipoRetencion']['saldolimite'];
                $operacionesretenciones = $objHisRetencionPersona->obtenerTodosSubMayorRetenciones($idretencionpersona);
                //Si tiene operaciones
                if (count($operacionesretenciones) > 0) {
                    $saldoadeudo = 0;
                    $saldoadeudomesanterior = 0;
                    foreach ($operacionesretenciones as $ip => $oper) {
                       // print_r($saldoinicial);die;
                        $retenido = $oper['retenido'];
                        //Si es la primera operacion

                        if ($ip == 0) {
                            $saldoadeudo = !empty($saldoinicial)? $saldoinicial - $retenido:0.00;
                            $saldoadeudo = $saldoadeudo <= 0 ? 0.00 : $saldoadeudo;
                            //print_r(!empty($saldoinicial));die;
                        } 
                        
                        else {
                            //Si no es la primera iteracion  y no tiene saldo inicial
                           if (empty($saldoinicial)) {

                            $saldoadeudo = number_format(0, 2, '.', '');
                           }
                           else{
                               //Si lo que le quedaba por retener es mayor q la retencion a aplicar
                            if (($saldoadeudomesanterior - $retenido) <= 0) {
                                $saldoadeudo = number_format(0, 2, '.', '');
                            }
                            else {
                                $saldoadeudo = number_format($saldoadeudomesanterior - $retenido, 2, '.', '');
                           }
                        }}
                        //Actualizando el saldo del adeudo del historico de retenciones
                        $objHisRetUpdate = Doctrine::getTable('HisRetencionesPersona')->find($oper['idhisretencionpersona']);
                        $objHisRetUpdate->saldodeladeudo = $saldoadeudo;
                        $objHisRetUpdate->retenido = $retenido;
                        $objHisRetUpdate->save();
                        $saldoadeudomesanterior = $saldoadeudo;
                    }
                }
            }
        }
        
    }

    /*
        Accion para cuadrar el submayor de retenciones por nominas
    */
    public function cuadrarSubmayorxNominasAction()
    {
        $arrayelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('arrayidperiodos')));
        $idestructura = $this->_getParam('identidad');
        $arraypersonas = array();
        //Recorro los periodos de pagos seleccionados para obtener las personas y los datos de las nominas
        foreach($arrayelaborarpagos as $pago){
            $datosnomina = $this->objNominaDatos->obtenerDatosNominaPorElaborarPago($pago);
            foreach($datosnomina as $datos){
                $valores = unserialize($datos['valores']);
                $estructura = unserialize($datos['estructura']);
                $camposretenciones = array();
                foreach($estructura as $est){
                    //Valido que si el campo es de tipo retencion
                    if($est['camposcalcular']->tipoconcepto == 2){
                        $camposretenciones[$est['id']]['denominacion']=$est['denominacion'];
                        $tiporetencion = explode('_',$est['camposcalcular']->idconcepto);
                        $camposretenciones[$est['id']]['idtiporetencion']=$tiporetencion[1];
                    }
                }
                foreach($valores as $valor){
                    $retenciones = array();
                    //Valido por los campos retenciones si se les aplicaron a la persona
                    foreach($camposretenciones as $key => $campos){
                        $saldo = $valor['c'.$key];
                        if($saldo > 0){
                            $retenciones[$key] = $campos;
                        }
                    }
                    //Si tiene retenciones se les adiciona a la persona
                    if($retenciones){
                        $arraypersonas[$pago][$valor['idpersona']]['idnomina']=$valor['idnomina'];
                        $arraypersonas[$pago][$valor['idpersona']]['retenciones']=$retenciones;
                    }else{
                        $arraypersonas[$pago][$valor['idpersona']]['idnomina']=$valor['idnomina'];
                    }
                }
            }
        }
        //Si el arreglo de personas no está vacio entonces cominezo a cuadrar


        if(!empty($arraypersonas)){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        foreach($arraypersonas as $key => $periodo){
            $sqlfechafinperiodo = "select dep.fechafinperiodo from mod_nomina.dat_elaborarpagos dep where idelaborarpagos = $key";
            $fechafinperiodo = $conn->fetchOne($sqlfechafinperiodo);
            foreach($periodo as $id => $persona){
                $idnomina = $persona['idnomina'];
                $arrayidtiposretencion = array();

                if($persona['retenciones']){
                    foreach($persona['retenciones'] as $tiporetencion){
                        $arrayidtiposretencion[] = $tiporetencion['idtiporetencion']; 
                    }
                    //Obtengo las retenciones activas de la persona
                    $sql = "SELECT rp.idretencionpersona,rp.idtiporetencion, rp.saldoinicial, rp.mensualidad,rp.ultmensualidad,tr.saldolimite,tr.tienelimitemaximo
                            FROM mod_nomina.dat_retencionpersona rp
                            INNER JOIN mod_nomina.nom_tiporetencion tr ON (tr.idtiporetencion = rp.idtiporetencion)
                            WHERE rp.idpersona = $id AND (rp.fechafin IS NULL OR rp.fechafin >= now()) AND rp.activo=1 and tr.idtiporetencion in (" . implode(',', $arrayidtiposretencion) . ")
                            and rp.fechainicio < '$fechafinperiodo'::date";
                    $retencionespersona = $conn->fetchAll($sql);
    
                    if(!empty($retencionespersona)){
    
                    $arrayretencionper = array();
                    foreach($retencionespersona as $retencionper){
                        $arrayretencionper[] = $retencionper['idretencionpersona']; 
                    }
                        // $sqldelete = "DELETE FROM mod_nomina.his_retencionpersona WHERE idretencionpersona not in (".implode(',',$arrayretencionper).") and idnomina = $idnomina";
                        // $conn->execute($sqldelete);
                    $sqldeletera = "DELETE FROM mod_nomina.dat_retencionesaplicadasporpersona WHERE idpersona = $id and idelaborarpagos = $key and idtiporetencion not in (" . implode(',', $arrayidtiposretencion) . ")" ;
                    $conn->execute($sqldeletera);
                    
                        foreach($retencionespersona as $retencion){
                            //Verifico si tiene operaciones en el historico para la nomina
                            $sqlhist = "select hr.idhisretencionpersona from mod_nomina.his_retencionpersona hr
                                        where hr.idretencionpersona = ? and hr.idnomina = $idnomina ";
                            $resultado = $conn->fetchAll($sqlhist, array($retencion['idretencionpersona']));
                            //Si no tiene operaciones entonces la adiciono
                            if(!count($resultado)>0){
                            //Obtengo los datos de la operacion anterior para realizar los calculos                             
                            $objHisRetencionSave = new HisRetencionesPersona();    
                            $retenido = $retencion['mensualidad'];
                            $sqloperacionanterior = "select hrp.saldodeladeudo from mod_nomina.his_retencionpersona hrp
                            where hrp.idretencionpersona = ? and hrp.idnomina < ?
                            order by hrp.fechaoperacion desc limit 1 offset 0";
                            $operacionanterior = $conn->fetchOne($sqloperacionanterior, array($retencion['idretencionpersona'],$idnomina));
                            $saldodeladeudo = 0.00;
                            $retencionpendiente = 0.00;
                            $saldodeladeudopendiente = 0.00;
                            //Si tiene opracion anterior es que no es la primera 
                            if($operacionanterior){
                                //Si el calculo da menor de 0 es que es la ultima operacion
                                if($operacionanterior - $retenido < 0){
                                    $retenido = $operacionanterior;
                                }else{
                                $saldodeladeudo = $operacionanterior - $retenido;    
                                }
                                //Si la operacion es la primera entonces se le resta al saldo inicial
                            }elseif($retencion['saldoinicial']){
                                $saldodeladeudo = $retencion['saldoinicial'] - $retenido;
                            }
                                //Procedo a insertar en las retenciones aplicadas
                                $objRetAplicadas = new DatRetencionesAplicadasPorPersona();
                                $objRetAplicadas->idelaborarpagos = $key;
                                $objRetAplicadas->idpersona = $id;
                                $objRetAplicadas->idtiporetencion = $retencion['idtiporetencion'];
                                $objRetAplicadas->save();
                                //Procedo a insertar en el historico de retenciones
                                $objHisRetencionSave->idretencionpersona = $retencion['idretencionpersona'];
                                $objHisRetencionSave->idnomina = $idnomina;
                                $objHisRetencionSave->retenido = $retenido;
                                $objHisRetencionSave->fechaoperacion = $fechafinperiodo;
                                $objHisRetencionSave->saldodeladeudo = $saldodeladeudo;
                                $objHisRetencionSave->retencionpendiente = $retencionpendiente;
                                $objHisRetencionSave->saldodeladeudopendiente = $saldodeladeudopendiente;
                                $objHisRetencionSave->save();
    
                            }
                                //Si existen operaciones duplicadas las elimino y solo me quedo con una
                            elseif(count($resultado)>1){
                                unset($resultado[0]);
                                $sqldelete = "DELETE FROM mod_nomina.his_retencionpersona WHERE idhisretencionpersona in (".implode(',',$resultado).")";
                                $conn->execute($sqldelete);
                            }
                            
                            
                        }
                    } 
                }else{
                            //Eliminar las operaciones de las retenciones que no pertenecen a la nomina
                    $sql = "SELECT rp.idretencionpersona
                            FROM mod_nomina.dat_retencionpersona rp
                            WHERE rp.idpersona = $id AND (rp.fechafin IS NULL OR rp.fechafin >= now())";
                    $retencionespersona = $conn->fetchAll($sql);
                    if(!empty($retencionespersona)){
                        $arrayretencionper = array();
                    foreach($retencionespersona as $retencionper){
                        $arrayretencionper[] = $retencionper['idretencionpersona']; 
                    }
                    $sqldelete = "DELETE FROM mod_nomina.his_retencionpersona WHERE idretencionpersona in (".implode(',',$arrayretencionper).") and idnomina = $idnomina";
                    $conn->execute($sqldelete);
                    $sqldeletera = "DELETE FROM mod_nomina.dat_retencionesaplicadasporpersona WHERE idpersona = $id and idelaborarpagos = $key";
                    $conn->execute($sqldeletera);

                    }

                }   
            }
        }
        $conn->commit();
        //Cuadro por operaciones para que acomode los calculos
        $this->cuadrarSubmayorxOperaciones($idestructura);
        echo json_encode('ok');
        }
        else{
            echo json_encode('failure');
        }
    }

    /**
     * Accion para capturar los tipos de nominas.
     */
    public function obtenertiposnominaAction()
    {
        $objTiposNomina = new NomTipoNomina();
        $arraytiposnomina = $objTiposNomina->obtenerListadoTodosTiposNomina();
        $cantidad = count($arraytiposnomina);
        //Imprimiendo los tipos de nomina
        //print_r($arraytiposnomina);die;
        echo Zend_Json::encode(array('datos' => $arraytiposnomina, 'cantidad' => $cantidad));
    }

    public function exportarRetencionesXpersonaAction()
    {
        //Creando el modelo de negocio de gestión de retenciones de las personas.
        $ObjNegocioRetenPer = new DatRetencionPersonaModel();

        $idpersona = $this->_getParam('idpersona');
        $identidad = $this->_getParam('identidad', 0);

        //Obteniendo el listado de las retenciones de la persona.
        $arrayRetenciones = $ObjNegocioRetenPer->obtenerListadoAexportarRetencionesPersona($idpersona, $identidad);

        $arrayHisRetenciones = array();
        $modeloNegocioRetenPer = new HisRetencionesPersona();
        foreach ($arrayRetenciones as $indice => $valoresretencion) {
            $idretencionpersona = $valoresretencion['idretencionpersona'];
            $arrRetenc = $modeloNegocioRetenPer->obtenerHistoricoSubMayorRetencionesAexportar(
                $idretencionpersona
            );
            array_push($arrayHisRetenciones, $arrRetenc);
        }

        $ObjNegocioRetenPer->exportarRetenciones($identidad, $idpersona, $arrayRetenciones, $arrayHisRetenciones);

    }

    public function exportarListadoRetencionesAplicadasAction()
    {
        $identidad = $this->_getParam('identidad', 0);
        $ObjNegocioRetenPer = new DatRetencionPersonaModel();
        $ObjDatRetencionesPer = new DatRetencionPersona();
        //Obteniendo el listado de las personas con retencion.
        $arrayPersonasRetenciones = $ObjDatRetencionesPer->obtenerListadoRetencionesPersona($identidad);
        //Eliminar duplicados por idpersona
        $arrayPersonasRetenciones = $this->eliminarDuplicadosPorIdPersona($arrayPersonasRetenciones);

        foreach ($arrayPersonasRetenciones as $key => $value) {
            $arrayidpersonas[] = $value['idpersona'];
        }

        $arrayRetenciones = $ObjDatRetencionesPer->obtenerReterncionesPersonasEntidad($identidad, $arrayidpersonas);
        $ObjNegocioRetenPer->exportarPersonasRetenciones($identidad, $arrayRetenciones);
    }
    /**
     * Método auxiliar para eliminar duplicados de un arreglo por idpersona
     * @param array $arrPersonas Arreglo de personas
     * @return array Arreglo sin duplicados por idpersona
     */
    private function eliminarDuplicadosPorIdPersona($arrPersonas)
    {
        $arrSinDuplicados = array();
        $idsPersonasVistos = array();
        
        foreach ($arrPersonas as $persona) {
            if (!in_array($persona['idpersona'], $idsPersonasVistos)) {
                $idsPersonasVistos[] = $persona['idpersona'];
                $arrSinDuplicados[] = $persona;
            }
        }
        
        return $arrSinDuplicados;
    }

    /******************aqui***************************/
    public function listadoDeduccionesAplicadasAction()
    {
        //Creando el modelo de negocio de gestión de retenciones de las personas.
        $ObjNegocioRetenPer = new DatRetencionPersonaModel();
        $fechafin = $this->_getParam('fechafin');
        $fechainicio = $this->_getParam('fechainicio');
        $identidad = $this->_getParam('identidad');
        $tiporeporte = $this->_getParam('tiporeporte');
        $arrayTipoRetenciones = json_decode(stripslashes($this->_getParam('arrayTipoRetenciones')));
        if ($tiporeporte == 1)
            $ObjNegocioRetenPer->exportarListadoDeduccionesAplicadas($identidad, $fechainicio, $fechafin, $arrayTipoRetenciones);
        else
            $ObjNegocioRetenPer->exportarListadoTodasRetenciones($identidad, $arrayTipoRetenciones);
    }

    /******************obteneridelaborarpago***************************/
    public function obteneridelaborarpagoAction()
    {
        $arrAux = array();
        $arrAuxfinal = array();
        $arrDatosGenerales = array();
        $idpersonaselc = $this->_getParam('idpersona');

        $ObjNomina = new DatNomina();
        $arrCRM = $ObjNomina->getIdElaboararpagos($this->_getParam('idnomina'));
        $campos = unserialize($arrCRM[0]['campos']);
        $valores = unserialize($arrCRM[0]['valores']);

        $arrDatosGenerales['tipopago'] = $arrCRM[0]['tipopago'];
        $arrDatosGenerales['periodopago'] = $arrCRM[0]['periodopago'];
        $arrDatosGenerales['fechainicioperiodo'] = $arrCRM[0]['fechainicioperiodo'];
        $arrDatosGenerales['fechafinperiodo'] = $arrCRM[0]['fechafinperiodo'];

        foreach ($valores as $k => $v) {
            if ($v['idpersona'] == $idpersonaselc) {
                $arrAux = $v;
            }
        }
        foreach ($campos as $kc => $vcampos) {

            $arrAuxfinal[$kc]['campo'] = $vcampos['denominacion'];
            $arrAuxfinal[$kc]['valor'] = $arrAux[$vcampos['indice']];
        }


        echo Zend_Json::encode(array('indicadores' => $arrDatosGenerales, 'valores' => $arrAuxfinal, 'cant' => count($arrAuxfinal)));
    }

    /******************aqui***************************/
    public function obtenerIndicadoresRetencionesAction()
    {
        $identidad = $this->_getParam('identidad');
        $idtiponomina = $this->_getParam('idtiponomina');
        //Arreglo de conceptos de la retribución monetaria.
        /*$arrCRM = NomConceptoRM::obtenerListadoConceptosRM();
        //Conceptos RM
        foreach ($arrCRM as $k => $v) {
            $arrR[] = array('idindicador' => 'CRM_' . $v['idconceptorm'], 'indicador' => $v['denominacion'], 'tipo' => 'Conceptos Ret. Mon.');
        }*/
        //Estructura de la nomina
        $arrEstNom = ConfigEstructurarModelosNomina::obtenerAllDatosModeloNominaxIdTipoNomina($identidad, $idtiponomina);
        //Conceptos RM
        foreach ($arrEstNom as $k => $v) {
            $arrR[] = array('idindicador' => 'ESTN_' . $v['idestructuramodelodomina'], 'indicador' => $v['denominacion'], 'tipo' => 'Estructura nomina');
        }
        //Arreglo de variables globales.
        $arrVG = NomVariableGlobalModel::obtenerTodasVariablesGlobales();

        foreach ($arrVG as $k => $v) {
            $arrR[] = array('idindicador' => 'VG_' . $v['idrariableglobal'], 'indicador' => $v['denominacion'], 'tipo' => 'Variables globales');
        }
        //Arreglo del campo retenciones.
        $arrR[] = array('idindicador' => 'RET_0', 'indicador' => 'Retenciones', 'tipo' => 'Retenciones');


        echo Zend_Json::encode(array('indicadores' => $arrR));
    }

    public function obtenerIdsFormulasAction()
    {
        $ioc = ZendExt_IoC_Inter::getInstance();
        //Arreglo de los idexpresionmatematica de las formulas de las retenciones para el tipo de nomina seleccionado.
        $r = new stdClass();
        $arridsformulasret = ConfCondicionesRetenciones::obtenerCondicionesRetencionesPorTipoNomina($this->_getParam('idtiponomina'));
        //Id de la configuración de condiciones retenciones
        $r->idcondicionesretenciones = $arridsformulasret[0]['idcondicionesretenciones'];
        //Datos de la formula del text area "Condición retenciones"
        $r->formulacumpleretenciones = (!empty($arridsformulasret[0]['formulacumpleretenciones'])) ? $arridsformulasret[0]['formulacumpleretenciones'] : -1;
        if ($r->formulacumpleretenciones != -1) {
            $rf = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($r->formulacumpleretenciones));
            $r->textocumpleretenciones = $rf[0]['expresionamostrar'];
        } else
            $r->textocumpleretenciones = '';

        //Datos de la formula del text area "Límite máximo"
        $r->formulalimiteretenciones = (!empty($arridsformulasret[0]['formulalimiteretenciones'])) ? $arridsformulasret[0]['formulalimiteretenciones'] : -1;
        if ($r->formulalimiteretenciones != -1) {
            $rf = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($r->formulalimiteretenciones));
            $r->textolimiteretenciones = $rf[0]['expresionamostrar'];
        } else
            $r->textolimiteretenciones = '';
        echo(json_encode($r));
    }

    public function adicionarFormulasAction()
    {
        $idcondicionesretenciones = $this->_request->getPost('idcondicionesretenciones');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
        $tipoexpresion = $this->_request->getPost('tipoexpresion');
        $objConfRegistroSalario = new ConfCondicionesRetencionesModel();
        echo json_encode($objConfRegistroSalario->adicionarFormulas($idcondicionesretenciones, $idtiponomina, $idexpresionmatematica, $tipoexpresion));
    }

    public function limpiarFormulasRetencionAction()
    {
        //Eliminando fórmulas de retención del tipo de nómina.
        $obj = ConfCondicionesRetencionesModel::limpiarFormulas($this->_getParam('idtiponomina'));
        if ($obj == "ok")
            echo "{'codMsg':'1'}";
        else
            echo "{'codMsg':'0'}";
    }

    public function obtenerOperacionContableConfiguradaAction()
    {
        
        $idestructura = $this->_request->getPost('idestructura');
        //obteniendo en maestro el id del modulo de nomina
        $sql = "select idmodulo from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $modulo = $conn->fetchOne($sql);
        if ($modulo) {
            $objConfMod = new ConfGeneralesModulo();
            $idoperacion = $objConfMod->obtenerOperacionDadoIdModulo($modulo, $idestructura);
            if ($idoperacion) {
                $operacion = $this->integrator->datosmaestros->obtenerOperaciones(null, null, null, $idoperacion);
                /*$sql = "select denominacion from mod_datosmaestros.nom_operacion where idnomoperaciones = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $op = $conn->fetchOne($sql, array($idoperacion));*/
                $obj->idoperacion = $operacion[0]['idnomoperaciones'];
                $obj->operacion = $operacion[0]['denominacion'];
                echo json_encode($obj);
            }
        }
    }

    public function obtenerOperacionesContablesAction()
    {
        $idsubsistema = $this->global->Subsistema->idsubsistema;
        $arrayresult = array();
        $cont = 0;
        /*$sql = "select * from mod_datosmaestros.nom_operacion;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $operaciones = $conn->fetchAll($sql);*/
        $operaciones = $this->integrator->datosmaestros->obtenerOperaciones();
        foreach ($operaciones as $rop) {
            if($rop['idsubsistema'] == $idsubsistema){
                $arrayresult[$cont]['idoperacion'] = $rop['idnomoperaciones'];
                $arrayresult[$cont]['operacion'] = $rop['denominacion'];
                $cont++;
            }
            
        }

        echo json_encode(array('datos' => $arrayresult, 'cantidad' => count($arrayresult)));
    }

    public function guardarOperacionesContablesAction()
    {
        $idoperacion = $this->_request->getPost('idoperacion');
        $idestructura = $this->_request->getPost('idestructura');
        if ($idoperacion) {
            //obteniendo en maestro el id del modulo de nomina
            $sql = "select idmodulo from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $modulo = $conn->fetchOne($sql);
            if (!$modulo) {
                $objModulo = new DatModulo();
                $objModulo->identificador = 'nomina';
                $objModulo->denominacion = 'Nomina';
                $objModulo->cobroypago = 1;
                $objModulo->parrafofiscal = 1;
                $objModulo->save();
                $modulo = $objModulo->idmodulo;
            }
            //Si tiene operacio se actualiza, sino se salve
            $sql = "select count(cgm.idconfgeneralesmodulo) from mod_rrhhmaestro.conf_confgeneralesmodulo cgm
                inner join mod_rrhhmaestro.dat_modulo dm on (dm.idmodulo = cgm.idmodulo) where cgm.idmodulo = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $cantconf = $conn->fetchOne($sql, array($modulo));
            //Save
            if ($cantconf == 0) {
                $objConfGeneralesModulo = new ConfGeneralesModulo();
                $objConfGeneralesModulo->idmodulo = $modulo;
                $objConfGeneralesModulo->idoperacionretencion = $idoperacion;
                $objConfGeneralesModulo->identidad = $idestructura;
                $objConfGeneralesModulo->save();
            } else {
                $idconf = ConfGeneralesModulo::obtenerIdConfGeneralesModulolDadoIdModulo($modulo);
                $objConfGeneralesModulo = ConfGeneralesModulo::obtenerConfGeneralesModulolDadoId($idconf);
                $objConfGeneralesModulo->idoperacionretencion = $idoperacion;
                $objConfGeneralesModulo->identidad = $idestructura;
                $objConfGeneralesModulo->save();
            }
        }
        echo json_encode('ok');
    }

    public function generarComprobanteAction()
    {

    }

    public function contabilizarRetencionesAction()
    {
        $idestructuraE = $this->global->EstructuraEconomica->idestructurae;
        if($idestructuraE){
            $idestructura = $this->_request->getPost('idestructura');
            $saldoret = DatRetencionPersona::obtenerCantRetencionesSinComprobante($idestructura);
            //obteniendo en maestro el id del modulo de nomina
            $sql = "select * from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $modulo = $conn->fetchAll($sql);
            if ($modulo[0]['cobroypago'] == 1) {
                $arrpersonasretenciones = DatRetencionPersona::obtenerListadoRetencionesSinComprobante($idestructura);//print_r($arrpersonasretenciones);die;
                if ($saldoret > 0) {
                    //Si hay personas con RM sin comprobantes posteados
                    if (count($arrpersonasretenciones) > 0) {
                        $contobjContable = 0;
                        $objContable = array();
                        foreach ($arrpersonasretenciones as $imod => $modelo) {
                            //Debito
                            $objContable[$contobjContable]['idmodelo'] = null;
                            $objContable[$contobjContable]['creditodebito'] = 2;
                            $objContable[$contobjContable]['tipocuenta'] = null;
                            $objContable[$contobjContable]['obligacion'] = null;
                            $objContable[$contobjContable]['porciento'] = 100;
                            $objContable[$contobjContable]['importe'] = $modelo['saldoinicial'];
                            $objContable[$contobjContable]['cuentacontable'] = $modelo['idcuenta'];
                            $contobjContable++;
                            //Credito
                            $objContable[$contobjContable]['idmodelo'] = null;
                            $objContable[$contobjContable]['creditodebito'] = 1;
                            $objContable[$contobjContable]['tipocuenta'] = null;
                            $objContable[$contobjContable]['obligacion'] = null;
                            $objContable[$contobjContable]['porciento'] = 100;
                            $objContable[$contobjContable]['importe'] = $modelo['saldoinicial'];
                            $objContable[$contobjContable]['cuentacontable'] = $modelo['NomTipoRetencion']['cuentacontable'];
                            $contobjContable++;

                        }
                    }

                }

                //AQUI EMPIEZA EL CODIGO DEL COMPROBANTE
                $idsubsistema = $this->global->Subsistema->idsubsistema;

                $fechacontable = $this->integrator->datosmaestros->fechaContableSubsistema($idestructura, $idsubsistema);
                //$fechacontable = Date('d/m/Y');
                //Datos de contabilidad y datosmaestros
                $monedaContable = $this->integrator->datosmaestros->buscarMonedaContable();
                $idmoneda = $this->integrator->datosmaestros->buscarIdMonedaEntidad($monedaContable->idmoneda, $idestructura);
                //$tasaObj = $this->integrator->datosmaestros->buscarTasaActual($idmoneda);
                $tasaObj = $this->integrator->datosmaestros->getTasaByMonedas($monedaContable->idmoneda, $monedaContable->idmoneda, null);

                $moneda = $monedaContable->codigoiso;
                $idtasa = $tasaObj[0]['idtasa'];
                $compra = $tasaObj[0]['compra'];
                $factordeconversion = $tasaObj[0]['factordeconversion'];
                $arraydatosopcc = $this->integrator->datosmaestros->obtenerOperaciones($idestructura, 71, null, null);

                //Comprobante
                $contdataAnotacion = 0;
                $objComprobante = new stdClass(); //se crea un objeto que representa el comprobante
                $objComprobante->detalle = "Contabilización de las retenciones";
                $objComprobante->observacion = "Contabilización de las retenciones";
                $objComprobante->fechaContable = $fechacontable; //Aquí va la fecha contable del subsistema
                $objComprobante->idsubsistema = $idsubsistema; //Aquí va el id del subsistema
                $objComprobante->idmoneda = $monedaContable->idmoneda; //Aquí va el id del subsistema
                $objComprobante->idtasa = $idtasa; //Aquí va el id del subsistema
                $objComprobante->idtipocomprobante = 3; //Comprobante tipo operaciones

                foreach ($objContable as $io => $rcop) {
                    $dataCuenta = $this->integrator->contabilidad->obtenerCuentaPorId($rcop['cuentacontable']);
                    $objComprobante->dataComprobante[$contdataAnotacion]->coddocprim = 'RET';//$codigomodelocontable;
                    $objComprobante->dataComprobante[$contdataAnotacion]->idoperacion = $arraydatosopcc[0]['idnomoperaciones'];
                    $objComprobante->dataComprobante[$contdataAnotacion]->operacion = 'Contabilización de las retenciones';
                    $objComprobante->dataComprobante[$contdataAnotacion]->numerodocumento = $arraydatosopcc[0]['iddocumento'];
                    $objComprobante->dataComprobante[$contdataAnotacion]->iddocumento = $arraydatosopcc[0]['iddocumento'];
                    $objComprobante->dataComprobante[$contdataAnotacion]->concatcta = $dataCuenta->concatctax;
                    $objComprobante->dataComprobante[$contdataAnotacion]->idcuenta = $dataCuenta->idcuenta;
                    $objComprobante->dataComprobante[$contdataAnotacion]->cuenta = $dataCuenta->text;
                    $objComprobante->dataComprobante[$contdataAnotacion]->idnaturaleza = $dataCuenta->idnaturaleza;
                    //$dataAnotacion[$contdataAnotacion]['idtipocuenta'] = $dataCuenta->idtipocuenta;
                    $objComprobante->dataComprobante[$contdataAnotacion]->contabilidadAdicional = 0;
                    //$objComprobante->dataComprobante[$contdataAnotacion]->debitoCredito = ($rcop->creditodebito == 1) ? 0 : 1;
                    $debitocredito = 0;
                    if ($rcop['creditodebito'] == 1) {
                        $debitocredito = 0;
                    } else {
                        $debitocredito = 1;
                    }
                    $objComprobante->dataComprobante[$contdataAnotacion]->debitoCredito = $debitocredito;
                    //$objComprobante->dataComprobante[$contdataAnotacion]->idmoneda = $idmoneda;
                    $objComprobante->dataComprobante[$contdataAnotacion]->idmoneda = $monedaContable->idmoneda;
                    $objComprobante->dataComprobante[$contdataAnotacion]->moneda = $moneda;
                    //$objComprobante->dataComprobante[$contdataAnotacion]->idtasa = $idtasa;
                    $objComprobante->dataComprobante[$contdataAnotacion]->idtasa = $idtasa;
                    $objComprobante->dataComprobante[$contdataAnotacion]->compra = $compra;
                    $objComprobante->dataComprobante[$contdataAnotacion]->factordeconversion = $factordeconversion;
                    $objComprobante->dataComprobante[$contdataAnotacion]->importe = abs(round($rcop['importe'] * $rcop['porciento'] / 100, 2));
                    $objComprobante->dataComprobante[$contdataAnotacion]->importemb = abs(round($rcop['importe'] * $rcop['porciento'] / 100, 2));
                    $objComprobante->dataComprobante[$contdataAnotacion]->importemo = abs(round($rcop['importe'] * $rcop['porciento'] / 100, 2));
                    $objComprobante->dataComprobante[$contdataAnotacion]->porciento = $rcop['porciento'];
                    $objComprobante->dataComprobante[$contdataAnotacion]->docobl = $rcop['obligacion'];
                    $contdataAnotacion++;
                }//print_r($objComprobante);die;
                echo json_encode($objComprobante);

            } else {
                echo json_encode('NO-MODULO');
            }
        }
    }

    public function actualizarCobrosyPagosAction()
    {
        $idComprobante = $this->_request->getPost('idComprobante');
        $idestructura = $this->_request->getPost('idestructura');
        $idtasa = $this->_request->getPost('idtasa');
        $idmoneda = $this->_request->getPost('idmoneda');
        //obteniendo en maestro el id del modulo de nomina
        $sql = "select idmodulo from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $modulo = $conn->fetchOne($sql);
        if ($modulo) {
            $objConfMod = new ConfGeneralesModulo();
            $idoperacion = $objConfMod->obtenerOperacionDadoIdModulo($modulo, $idestructura);
            $arraydatosopcc = $this->integrator->datosmaestros->obtenerOperaciones(null, null, null, $idoperacion);
            //Si esta la operacion
            if ($idoperacion) {
                //Datos de la operacion para obtener el documento
                $sqlop = "select * from mod_datosmaestros.dat_operacionesentidad where idoperacionesentidad = ?";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrop = $conn->fetchAll($sqlop, array($arraydatosopcc[0]['idoperacionesentidad']));
                //Comprobante en contabilidad
                $sqlcomprobante = "select * from mod_contabilidad.dat_comprobante  where idcomprobante = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrcomp = $conn->fetchAll($sqlcomprobante, array($idComprobante));
                //Retenciones para aperturar cobor y pagos
                $arrpersonasretenciones = DatRetencionPersona::obtenerListadoRetencionesSinComprobante($idestructura);
                if (count($arrpersonasretenciones) > 0) {
                    foreach ($arrpersonasretenciones as $i => $ret) {
                        if ($ret['saldoinicial'] != 0) {
                            $arraypersonas = array();
                            $stdPase = new stdClass();
                            $stdPase->tipo = 1;
                            $stdPase->tipopersona = 3;
                            $stdPase->iddocumento = $ret['idretencionpersona'];//id tipo de retencion. Para vizualizar en cobros y pagos en el campo documento el nombre de la retencion
                            $stdPase->idcomprobante = $arrcomp[0]['idcomprobante'];//Datos del comprobante
                            $stdPase->numcomprobante = $arrcomp[0]['numerocomprobante'];//Datos del comprobante
                            $stdPase->fechacomprobante = $arrcomp[0]['fechaemision'];//Datos del comprobante
                            //$this->obtenerCondicionPago($documento['iddocumento'], $datosDocumentos['subsistema'], $stdPase);
                            $stdPase->numero = $ret['idretencionpersona'];//Id de la retencion de la persona para identificarla en cobros y pagos
                            $stdPase->idsubsistema = $arrcomp[0]['idsubsistema'];//Datos del comprobante
                            $stdPase->idperiodo = $arrcomp[0]['idperiodo'];//Datos del comprobante
                            $stdPase->fecha = $arrcomp[0]['fechaemision'];//Datos del comprobante
                            $stdPase->fechaemision = $arrcomp[0]['fechaemision'];//Datos del comprobante
                            $stdPase->comentario = $ret['NomTipoRetencion']['denominacion'];
                            $stdPase->idcliente = $ret['idpersona'];//Id persona
                            $stdPase->tipodocumento = $arrop[0]['iddoc'];//Id documento q tiene la operacion
                            $stdPase->importe = $ret['saldoinicial'];
                            $stdPase->idcuenta = $ret['NomTipoRetencion']['cuentacontable'];
                            $stdPase->idoperacioncontable = $idoperacion;
                            $stdPase->operaciones[0]->importemb = $ret['saldoinicial'];
                            $stdPase->operaciones[0]->importemo = $ret['saldoinicial'];
                            $stdPase->operaciones[0]->idmoneda = $idmoneda;
                            $stdPase->operaciones[0]->tasa = $idtasa;
                            $stdPase->operaciones[0]->idoperacioncontable = $idoperacion;
                            // $stdPase->idoperacioncontable = $arrop[0]['idoperacionesentidad'];
                            array_push($arraypersonas, $stdPase);
                            $idderechuobligacion = $this->integrator->copa->InsertarDerechoObligacionSubsistemaExterno(
                                $arraypersonas, $idestructura, $this->global->Subsistema->idsubsistema
                            );
                            if (count($idderechuobligacion)) {
                                $objRetSave = Doctrine::getTable('DatRetencionPersona')->find($ret['idretencionpersona']);
                                $objRetSave->idcomprobante = $idComprobante;
                                $objRetSave->iddocumentoobligacion = $idderechuobligacion;
                                $objRetSave->save();

                            }
                            $this->actualizarComprobante($idestructura,  $arrcomp[0]['numerocomprobante'], $ret['idretencionpersona']);
                        }
                    }//print_r($arraypersonas);die;
                    echo json_encode('ok');
                } else {
                    echo json_encode('NO-PERSONAS-RET');
                }
            } else {
                echo json_encode('NO-OPERACION-CONT');
            }
        } else {
            echo json_encode('NO-MODULO-CONF');
        }

    }

    public function actualizarComprobante($idestructura, $numerocomprobante, $idretencionpersona)
    {
        $sql = "UPDATE mod_nomina.dat_retencionpersona 
            SET 
            numerocomprobante = $numerocomprobante
            WHERE idretencionpersona = ? and identidad = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->fetchOne($sql, array($idretencionpersona, $idestructura));
    }

    public function validarPersonasSinComprobanteAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        //Personas con carga inicial y sin comprobante de operaciones asociado
        $arrpersonasretenciones = DatRetencionPersona::obtenerListadoRetencionesSinComprobante($idestructura);
        //Si no hay personas con cargas inicales nuevas que fijan obligaciones en cobros y pagos
        if (count($arrpersonasretenciones) == 0) {
            echo json_encode('NO-CARGAS-INICIALES-NUEVAS');
            return;
        } else {
            //Validar que no halla personas con retenciones que fijan obligaciones sin cuentas contables
            $textonombrespersonassincuenta = $this->validarPersonasFijanObligacionesSinCuentas($arrpersonasretenciones, $conn);
            if ($textonombrespersonassincuenta != '') {
                $objReturn->personasretsincuentas = 1;
                $objReturn->textopersonasretsincuentas = $textonombrespersonassincuenta;
                echo json_encode($objReturn);
                return;
                //Si  no hay personas con retenciones que fijan obligaciones sin cuentas contables
            } else {
                //Validar que no halla retenciones que fijan obligaciones sin cuentas contables
                $textonombresretencion = $this->validarRetencionesFijanObligacionesSinCuentas($arrpersonasretenciones, $conn);
                if ($textonombresretencion != '') {
                    $objReturn->retsincuentas = 1;
                    $objReturn->textoretsincuentas = $textonombresretencion;
                    echo json_encode($objReturn);
                    return;
                } else {
                    //Validar que este configurado en dat_modulo el modulo 'nomina' con cobroypago = 1
                    $sql = "select idmodulo from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina' and cobroypago = 1;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $idmodulo = $conn->fetchOne($sql);
                    if (!$idmodulo) {
                        $objReturn->nomodulonomina = 1;
                        $objReturn->textonomodulonomina = 'NO-MODULO-NOMINA-COBROS-PAGOS';
                        echo json_encode($objReturn);
                        return;
                    }else{
                        //Validar que halla una operacion contable asociada a la contabilizacion de las retenciones

                        $objConfMod = new ConfGeneralesModulo();
                        $idoperacion = $objConfMod->obtenerOperacionDadoIdModulo($idmodulo, $idestructura);
                        if(!$idoperacion){
                            $objReturn->nooperacionmodulonomina = 1;
                            $objReturn->textonooperacionmodulonomina = 'NO-OPERACION-MODULO-NOMINA';
                            echo json_encode($objReturn);
                        }else{
                            echo json_encode('OK');
                            return;
                        }
                    }
                }
            }
        }

    }

    public function validarPersonasFijanObligacionesSinCuentas($arrpersonasretenciones, $conn)
    {
        //Recorriendo las cargas iniciales de las retenciones que fijan obligaciones en cobros y pagos para validar si le falta la cuenta contable a alguna en el submayor de retenciones
        $arrretobligsincuenta = array();
        foreach ($arrpersonasretenciones as $rretboligaciones) {
            if (!$rretboligaciones['idcuenta']) {
                $arrretobligsincuenta[] = $rretboligaciones['idpersona'] . '-' . $rretboligaciones['NomTipoRetencion']['denominacion'];
            }
        }
        $textonombres = '';
        if (count($arrretobligsincuenta) > 0) {
            foreach ($arrretobligsincuenta as $rretsincuenta) {
                $rexplode = explode('-', $rretsincuenta);
                $idpersona = $rexplode[0];
                $denomretencion = $rexplode[1];
                $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
		        where dp.idpersona = ?;";
                $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($idpersona));
                $nombreapp = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
                if ($textonombres == '') {
                    $textonombres = $nombreapp . '-' . $denomretencion;
                } else {
                    $textonombres = $textonombres . ',' . $nombreapp . '-' . $denomretencion;
                }
            }
        }
        return $textonombres;
    }

    public function validarRetencionesFijanObligacionesSinCuentas($arrpersonasretenciones, $conn)
    {
        //Recorriendo las cargas iniciales de las retenciones que fijan obligaciones en cobros y pagos para validar si le falta la cuenta contable a alguna en el submayor de retenciones
        $arrretobligsincuenta = array();
        foreach ($arrpersonasretenciones as $rretboligaciones) {
            if (!$rretboligaciones['NomTipoRetencion']['cuentacontable']) {
                $arrretobligsincuenta[] = $rretboligaciones['NomTipoRetencion']['denominacion'];
            }
        }
        $arrretobligsincuenta = array_unique($arrretobligsincuenta);
        $textonombres = '';
        if (count($arrretobligsincuenta) > 0) {
            foreach ($arrretobligsincuenta as $rretsincuenta) {
                if ($textonombres == '') {
                    $textonombres = $rretsincuenta;
                } else {
                    $textonombres = $rretsincuenta . ',' . $rretsincuenta;
                }
            }
        }
        return $textonombres;
    }

    public function importarExcelRelencionesPersonasAction()
    { 
        $identidad = $this->_request->getPost('identidad');//print_r($identidad);die;

        //Solo para archivos de tipo .xls
        $inputFileType = 'Excel5';
        $dir_file = $_FILES['fileUpload']['tmp_name'];
        // comprobar si el fichero es de tipo xls
        $name_ficheroformato = $_FILES['fileUpload']['name'];
        $rexplodefichformato = explode('.', $name_ficheroformato);
        $nombrefichero = $rexplodefichformato[0];
        $formatofichero = $rexplodefichformato[1];
        if ($formatofichero == 'xls') {
            //Creando un Reader de PhpExcel para 2005
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            //solo lectura
            $objReader->setReadDataOnly(true);
            //Si la direccion del archivo existe
            if (file_exists($dir_file)){
                //Cargando el archivo
                $objPHPExcel = $objReader->load($dir_file);
                //Obteniendo los datos en un array
                $worksheettoarray = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);
                //Si el Excel tiene valores se empieza a leer desde la segunda fila pq la primera son los encabezados
                if (count($worksheettoarray) > 1) {                    
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $conn->beginTransaction();

                    $nombrespersonas = "";
                    $estado = 0;
                    
                    foreach($worksheettoarray as $i => $rw){
                         
                        if($i != 1){ 
                            $docidentidad = $rw['A']; //capturando el documento de identidad
                            $nombrepersona = $rw['B']; //capturando el nombre y apellidos
                            $tiporetencion = $rw['C']; //abreviatura del tipo de retencion
                            $saldoinicial = $rw['D'];
                            $mensualidad = $rw['E']; 
                            $ultimamensualidad = $rw['F'];
                            
                            $sql = "SELECT DISTINCT( dp.idpersona) from mod_persona.dat_persona dp
                                    inner join mod_persona.dat_docidentidad did on(did.idpersona = dp.idpersona)
                                    where did.numero like '$docidentidad'"; 
                            $datospersona = $conn->fetchAll($sql);  //obteniendo los datos del arreglo                            
                            $idpersona = $datospersona[0]['idpersona']; //obteniendo el id de la persona 
                            //capturando fecha actual
                            $fecha = date('d/m/Y');

                            //capturando el idtoporetencion por la abreviatura en la tabla nom_tiporetencion
                            $sqltiporetencion = "SELECT * FROM mod_nomina.nom_tiporetencion WHERE abreviatura = '$tiporetencion';";
                            $datostiporetencion = $conn->fetchAll($sqltiporetencion);
                            $idtiporetencion = $datostiporetencion[0]['idtiporetencion'];
                            $cuentacontable = $datostiporetencion[0]['cuentacontable'];

                            if ($docidentidad != '' && $nombrepersona != '' && $tiporetencion != '' && $saldoinicial != '' && $mensualidad != '') {
                                //ver si existe la persona en la tabla conf_personaretencion
                                $sqlexistepersona = "SELECT count(*) FROM mod_nomina.conf_personaretencion where idpersona = $idpersona and identidad = $identidad";
                                $existepersona = $conn->fetchOne($sqlexistepersona);

                                if ($existepersona == 0) {
                                    $sqlinserrpersona = "INSERT INTO mod_nomina.conf_personaretencion
                                        (idpersona, identidad) VALUES ($idpersona, $identidad);";
                                    $conn->execute($sqlinserrpersona);

                                    if ($ultimamensualidad > 0) {
                                        $sqlisertretencion ="INSERT INTO mod_nomina.dat_retencionpersona
                                            (idpersona,identidad,idtiporetencion,saldoinicial,mensualidad,ultmensualidad,refdocumentoacredita,fechadocumento,fechainicio,
                                            fechafin,prioridad,activo,idcomprobante,iddocumentoobligacion,idcuenta)
                                            VALUES (
                                            $idpersona,$identidad,$idtiporetencion,$saldoinicial,$mensualidad,$ultimamensualidad,null,'$fecha','$fecha',
                                            null,null,1,null,null,$cuentacontable);";
                                        $conn->execute($sqlisertretencion);
                                    }else {

                                        $sqlisertretencion ="INSERT INTO mod_nomina.dat_retencionpersona
                                            (idpersona,identidad,idtiporetencion,saldoinicial,mensualidad,ultmensualidad,refdocumentoacredita,fechadocumento,fechainicio,
                                            fechafin,prioridad,activo,idcomprobante,iddocumentoobligacion,idcuenta)
                                            VALUES (
                                            $idpersona,$identidad,$idtiporetencion,$saldoinicial,$mensualidad,null,null,'$fecha','$fecha',
                                            null,null,1,null,null,$cuentacontable);";
                                        $conn->execute($sqlisertretencion);
                                    }

                                } else {

                                    if ($ultimamensualidad > 0) {
                                        $sqlisertretencion ="INSERT INTO mod_nomina.dat_retencionpersona
                                            (idpersona,identidad,idtiporetencion,saldoinicial,mensualidad,ultmensualidad,refdocumentoacredita,fechadocumento,fechainicio,
                                            fechafin,prioridad,activo,idcomprobante,iddocumentoobligacion,idcuenta)
                                            VALUES (
                                            $idpersona,$identidad,$idtiporetencion,$saldoinicial,$mensualidad,$ultimamensualidad,null,'$fecha','$fecha',
                                            null,null,1,null,null,$cuentacontable);";
                                        $conn->execute($sqlisertretencion);
                                    }else {

                                        $sqlisertretencion ="INSERT INTO mod_nomina.dat_retencionpersona
                                            (idpersona,identidad,idtiporetencion,saldoinicial,mensualidad,ultmensualidad,refdocumentoacredita,fechadocumento,fechainicio,
                                            fechafin,prioridad,activo,idcomprobante,iddocumentoobligacion,idcuenta)
                                            VALUES (
                                            $idpersona,$identidad,$idtiporetencion,$saldoinicial,$mensualidad,null,null,'$fecha','$fecha',
                                            null,null,1,null,null,$cuentacontable);";
                                        $conn->execute($sqlisertretencion);
                                    }
                                }
                            } else { //guardar los datos de las personas con datos incompletos
                                $sqldatospersona = "SELECT replace(concat(trim(nombre),' ',trim(snombre), ' ',trim(papel), ' ',trim(sapel)),'  ',' ') as nombreyapellidos
                                    FROM  mod_personaext.dat_cuentabancaria dcb
                                    inner join mod_persona.dat_persona dp on (dp.idpersona = dcb.idpersona)                           
                                    where dcb.idpersona = $idpersona;"; 
                                $datosexistepersona = $conn->fetchAll($sqldatospersona);
                                
                                if($nombrespersonas == ""){
                                    $nombrespersonas = $datosexistepersona[0]['nombreyapellidos'];
                                }else{
                                    $nombrespersonas .= ", " . $datosexistepersona[0]['nombreyapellidos'];
                                }
                                $estado ++;
                            }

                        }              
                        $conn->commit();
                    }
                    $m->mensaje = $nombrespersonas;
                    $m->codigo = ($estado > 0) ? 'nook':'ok'; 
                    echo json_encode(array('success' => true, 'msg'=>$m));
                }

            }

        }

    }
}
