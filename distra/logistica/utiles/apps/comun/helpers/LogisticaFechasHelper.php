<?php

/**
 * Created by JetBrains PhpStorm.
 * User: maricet
 * Date: 5/09/14
 * Time: 3:27
 * Clase que contiene todos los metodos necesarios para el trabajo con fechas.
 */
class LogisticaFechasHelper implements ISingletonClass
{

    /**
     * Variables internas de la clase
     *
     */
    private $integrator = null;
    private $varglobal = null;
    private $serviciosConfigGenral;

    /**
     * Inicializando las variables
     *
     */
    private function __construct()
    {
        $this->serviciosConfigGenral = ServiciosConfiguracionGeneralHelper::__init();
        $this->integrator = ZendExt_IoC::getInstance();
        $this->varglobal = ZendExt_GlobalConcept::getInstance();
    }

    /**
     * Una instancia unica de LogisticaImagenesHelper
     *
     * @var LogisticaFechasHelper
     */
    private static $instance = null;

    /**
     * Creates a new instance of class LogisticaImagenesHelper
     *
     * @return LogisticaFechasHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new LogisticaFechasHelper;
        }
        return self::$instance;
    }

    /**
     * Metodo que devuelve la fecha contable con el separador (-)
     */
    public function obtenerFechaContable()
    {
        $fecha = $this->serviciosConfigGenral->getFechaContableSubsistema(
            $this->varglobal->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_INV
        );
        $fechaContable = explode(' ', $fecha->fecha);
        $fecha = split('[/-]', $fechaContable[0]);
        return $fecha;
    }

    /*
     * Permite obtener la fecha mayor entre dos fechas.
     * @param string fecha1
     * @param string fecha2
     * @param string formato1
     * @param string formato2
     * @autor Javier Glez Rodriguez
     */

    public function CmpFecha($fecha1, $fecha2, $formato1, $formato2)
    {
        if (version_compare(PHP_VERSION, '5.3.0') >= 0) {
            return self::fechaMayor53($fecha1, $fecha2, $formato1, $formato2);
        } else {
            return self::fechaMayor52($fecha1, $fecha2, $formato1, $formato2);
        }
    }

    /*
     * Obtener el mktime dado una fecha y formato
     * @param string fecha
     * @param string formato
     * @autor Javier Glez
     * Agregarle mas formatos de ser necesario
     * */

    public function getMktime($fecha, $formato)
    {
        //$date1 = mktime(0,0,0,mes, dia, ano);
        switch ($formato) {
            case 'd/m/Y': {
                $fecha = explode('/', $fecha);
                $date = mktime(0, 0, 0, $fecha[1], $fecha[0], $fecha[2]);
            }
                break;
            case 'Y/m/d': {
                $fecha = explode('/', $fecha);
                $date = mktime(0, 0, 0, $fecha[1], $fecha[2], $fecha[0]);
            }
                break;
            case 'd-m-Y': {
                $fecha = explode('-', $fecha);
                $date = mktime(0, 0, 0, $fecha[1], $fecha[0], $fecha[2]);
            }
                break;
            case 'Y-m-d': {
                $fecha = explode('-', $fecha);
                $date = mktime(0, 0, 0, $fecha[1], $fecha[2], $fecha[0]);
            }
                break;
        }

        return $date;
    }

    /*
     * Permite obtener la fecha mayor entre dos fechas.
     * @param string fecha1
     * @param string fecha2
     * @param string formato1
     * @param string formato2
     * @autor Javier Gonzalez Rodriguez
     * @version del php 5.3.*
     */

    public function fechaMayor53($fecha1, $fecha2, $formato1, $formato2)
    {

        $fecha1t = DateTime::createFromFormat($formato1, $fecha1);
        $fecha2t = DateTime::createFromFormat($formato2, $fecha2);

        $fecha1 = $fecha1t->format('Y-m-d');
        $fecha2 = $fecha2t->format('Y-m-d');

        $fecha1 = explode('-', $fecha1);
        $fecha2 = explode('-', $fecha2);

        $date1 = mktime(0, 0, 0, $fecha1[1], $fecha1[2], $fecha1[0]);
        $date2 = mktime(0, 0, 0, $fecha2[1], $fecha2[2], $fecha2[0]);

        $temp = max($date1, $date2);
        return ($date1 == $temp) ? 1 : 2;
    }

    /*
     * Permite obtener la diferencia entre dos fechas.
     * @param string    Formato yyyy-mm-dd
     * @param string    Formato yyyy-mm-dd
     * @author  Hermes Vaillant (QUIMEFA)
     * @author  Rafael Espinosa (QUIMEFA)
     */

    public function fechaUltima($fecha1, $fecha2)
    {

        $fecha1 = explode('-', $fecha1);
        $fecha2 = explode('-', $fecha2);

        $date1 = mktime(0, 0, 0, $fecha1[1], $fecha1[2], $fecha1[0]);
        $date2 = mktime(0, 0, 0, $fecha2[1], $fecha2[2], $fecha2[0]);

        return date('Y-m-d', max($date1, $date2));
    }

    /*
     * Permite obtener la diferencia entre dos fechas.
     * @param string    Formato yyyy-mm-dd
     * @param string    Formato yyyy-mm-dd
     * @author  Rafael Espinosa (QUIMEFA)
     */

    public function restarFechas($fecha1, $fecha2)
    {

        $fecha1 = explode('/', $fecha1);
        $fecha2 = explode('/', $fecha2);

        $date1 = mktime(0, 0, 0, $fecha1[1], $fecha1[0], $fecha1[2]);
        $date2 = mktime(0, 0, 0, $fecha2[1], $fecha2[0], $fecha2[2]);

        return abs(($date2 - $date1));
    }

    public function getfecha($fechas)
    {
        $fecha = split('[/-]', $fechas);
        return (strlen($fecha[0]) == 4) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : $fechas;
    }

    public function validarfechaperiodo()
    {


        $idperiodo = $this->varglobal->Periodo->periodoactual;
        $periodo = $this->serviciosConfigGenral->obtenerPeriodo($idperiodo);
        $fechaactual = $this->varglobal->FechaContable->fecha;
        list($dia, $mes, $anno) = explode('/', $fechaactual);
        list($dia1, $mes1, $anno1) = explode('/', $periodo->fin);
        $fecha = mktime(0, 0, 0, $mes, $dia, $anno);
        $fechafinperiodo = mktime(0, 0, 0, $mes1, $dia1, $anno1);
        if ($fecha < $fechafinperiodo) {
            return true;
        }
        return false;
    }


    public function cerrarDiaDeposito($idDeposito, $cierreMes = false){
        /*$fechaActual = $this->varglobal->FechaContable->fechasist;
        $datos = LogisticaDoctrineHelper::__init()->executeQuery("
        select fecha, (fecha + interval '1 day')::date as proxfecha,
        to_char((fecha + interval '1 day'), 'TMMonth')::numeric as mes 
         from mod_logistica.dat_estadoalmacen where iddeposito = {$idDeposito}")->fetchAll(PDO::FETCH_ASSOC);;
        print_r($datos);die;
        if($datos[0]['proxfecha'] > $fechaActual){
            throw new ZendExt_Exception('LOG_LB_CIERE_009'); 
        }*/

        if(is_null($idDeposito)){
            return true;
        }
        if(!$cierreMes){
            LogisticaDoctrineHelper::__init()->executeQuery( "update mod_logistica.dat_estadoalmacen  set fecha = (fecha + interval '1 day') where iddeposito = {$idDeposito} and fecha < ((date_trunc('month', fecha) + interval '1 month') - interval '1 day')::date");
        }else{
            LogisticaDoctrineHelper::__init()->executeQuery( "update mod_logistica.dat_estadoalmacen  set fecha = (((date_trunc('month', fecha) + interval '1 month') - interval '1 day')::date + interval '1 day')::date where iddeposito = {$idDeposito} and fecha is not null");
        }
    }

    public function cierrePeriodo(){
        $idEntidad = $this->varglobal->Estructura->idestructura;
        $almacenes = LogisticaDoctrineHelper::__init()
            ->executeQuery("select distinct idestructura from mod_logistica.dat_producto dp where dp.idestructuracomun = {$idEntidad}")->fetchAll(PDO::FETCH_ASSOC);
        foreach ($almacenes as $almacen){
            $this->cerrarDiaDeposito($almacen['idestructura'], true);
        }
    }

    public function getFechaDeposito($idDeposito){
        if(is_null($idDeposito))
            return false;
		if(is_array($idDeposito)){
			$idDeposito = implode(',',$idDeposito);
		}
        $datos  = LogisticaDoctrineHelper::__init()->executeQuery( "select fecha from mod_logistica.dat_estadoalmacen where iddeposito in ({$idDeposito})")->fetchAll(PDO::FETCH_ASSOC);
        return count($datos) > 0 ? $datos[0]['fecha'] : false;
    }

    /**
     * Metodo para establecer las fechas de los depositos de manera individual.
     */
    public function configurarFechaEntidad(){
        $idEntidad = $this->varglobal->Estructura->idestructura;
        $fecha = $this->serviciosConfigGenral->getFechaContableSubsistemaObj($idEntidad, LogisticaGlobal::SUBSISTEMA_INV)->fecha;
        LogisticaDoctrineHelper::__init()->executeQuery ("update mod_logistica.dat_estadoalmacen set fecha = '{$fecha}' where iddeposito in (select distinct idestructura from mod_logistica.dat_producto dp where dp.idestructuracomun = {$idEntidad})") ;
    }

}
