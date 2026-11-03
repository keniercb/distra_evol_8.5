<?php

/**
 * ZendExt_TraceLog
 *
 * clase para guardar las trazas cuando no esta seleccionada la opcion fuera
 * de proceso en la configuracion de seguridad.
 *
 * @author     : Equipo de seguridad UCID
 * @copyright  UCID
 * @package    : ZendExt
 * @subpackage Tace
 * @version    2.0.0
 */
class TraceLog
{

    /**
     * Constructor de la clase, es privado para impedir que pueda
     * ser instanciado y de esta forma garantizar que la instancia
     * sea un singlenton
     *
     * @return void
     */
    private function __construct()
    {

    }

    static public function getInstance()
    {

        static $instance;
        if (!isset($instance)) {
            $instance = new self ();
        }
        return $instance;
    }

    /**
     * Funcion usada para salvar las trazas de inicio de accion.
     *
     * @param bool $pFault Identifica si fallo la traza.
     * @param bool $pBegin Identifica si comenzo la traza.
     * @param string $modRef Nombre del modulo.
     * @param string $control Nombre del controlador.
     * @param string $action Nombre de la accion ejecutada.
     * @param integer $categ Identificador del subsistema donde se ejecuto la accion.
     * @param string $user Usuario que ejecuto la accion.
     * @param integer $idestruc Identificador de la estructura donde se ejecuto la accion.
     *
     * @return ZendExt_Trace_Container_Action
     */
    public function beginTrace(
        $pController, $pAction, $pDescripcion, $pExecTime, $pMemory, $reference,
        $pUser, $ippc, $idsession, $subsistema, $categoria
    )
    {
        $beginTrace = new ZendExt_Trace_Container_Action(
            $pAction, $pController, $pDescripcion, $pExecTime, $pMemory, $reference, $pUser, $ippc, $idsession, $subsistema, $categoria
        );
//        $log = new ZendExt_Trace_Publisher_Log();
//        $db = new ZendExt_Trace_Publisher_Db();
//
//
//
//        $log->save($beginTrace);
        return $beginTrace;
        //$db->save($beginTrace);
    }


    /**
     * Salva las trazas de excepciones
     *
     * @param integer $code Codigo de la excepcion.
     * @param string $type Tipo de excepcion.
     * @param string $languaje Lenguaje de la exepcion.
     * @param string $mensaje Mensaje de la exepcion.
     * @param string $descripcion Descripcion de la exepcion.
     * @param string $log Error real.
     * @param integer $categoria Identificador del subsistema donde se ejecuto la accion.
     * @param string $user Usuario que ejecuto la accion.
     * @param integer $idestructura Identificador de la estructura donde se ejecuto la accion.
     *
     * @return ZendExt_Trace_Container_Exception
     */
    public function exceptionTrace(
        $code, $type, $languaje, $mensaje, $descripcion, $log, $categoria,
        $user, $ippc, $idsession, $subsistema, $categoriau
    )
    {

        $exceptionTrace = new ZendExt_Trace_Container_Exception(
            $code, $type, $languaje, $mensaje, $descripcion, $log, $categoria, $user, $ippc, $idsession, $subsistema, $categoriau
        );
//        $log = new ZendExt_Trace_Publisher_Log();
//        $db = new ZendExt_Trace_Publisher_Db();
//
////        $db->save($exceptionTrace);
//        $log->save($exceptionTrace);
        return $exceptionTrace;


    }

    /**
     * Funcion usada para salvar las trazas de integracion.
     *
     * @param string $targetCmp Componente destino.
     * @param tstring $class Clase que implementa el servicio.
     * @param string $method Servicio.
     * @param string $state Tipo de IoC (Interno o externo).
     * @param string $srcCmp Componente origen.
     * @param string $action Accion que desemboca la llamada al servicio.
     * @param integer $pIdTrace Identificador del subsistema donde se ejecuto la accion.
     * @param string $user Usuario que ejecuto la accion.
     * @param integer $pIdCom Identificador de la estructura donde se ejecuto la accion.
     *
     * @return ZendExt_Trace_Container_IoC.
     */
    public function beginTraceIoC(
        $state, $sourceComponent, $targetComponent, $class, $method,
        $reference, $usuario, $ippc, $idsession, $subsistema, $exectime, $memory, $categoria
    )
    {
        $beginTraceIoC = new ZendExt_Trace_Container_IoC($state, $sourceComponent, $targetComponent, $class, $method,
            $reference, $usuario, $ippc, $idsession, $subsistema, $exectime, $memory, $categoria);

//        $log = new ZendExt_Trace_Publisher_Log();
//        $db = new ZendExt_Trace_Publisher_Db();
//
////       $db->save($beginTraceIoC);
//       $log->save($beginTraceIoC);
        return $beginTraceIoC;

    }

    /**
     * Funcion usada para salvar las trazas de autenticacion.
     *
     * @param string $ipPc Ip de la PC cliente.
     * @param integer $categoria Identificador del subsistema donde se ejecuto la accion.
     * @param string $user Usuario autenticado.
     * @param integer $idestructura Identificador de la estructura donde se ejecuto la accion.
     *
     * @return ZendExt_Trace_Container_Autentication
     */
    public function traceAutenticacion($categoria, $user, $ippc, $idsession, $subsistema, $categoriaw)
    {
        $hisAutentication = new ZendExt_Trace_Container_Autentication(
            $categoria, $user, $ippc, $idsession, $subsistema, $categoriaw
        );
//        $log = new ZendExt_Trace_Publisher_Log();
//        $db = new ZendExt_Trace_Publisher_Db();
//        $log->save($hisAutentication);
//        $db->save($hisAutentication);
        return $hisAutentication;
    }

    /**
     * Funcion usada para salvar las trazas de autenticacion.
     *
     * @param string $ipPc Ip de la PC cliente.
     * @param integer $categoria Identificador del subsistema donde se ejecuto la accion.
     * @param string $user Usuario autenticado.
     * @param integer $idestructura Identificador de la estructura donde se ejecuto la accion.
     *
     * @return ZendExt_Trace_Container_FalloAutenticacion
     */
    public function traceFalloautenticacionLog($usuariointento, $ref, $user, $ippc, $idsession, $subsistema, $categoria)
    {

        $fallo = new ZendExt_Trace_Container_FalloAutenticacion(
            $usuariointento, $ref, $user, $ippc, $idsession, $subsistema, $categoria
        );

//        $log = new ZendExt_Trace_Publisher_Log();
//        $db = new ZendExt_Trace_Publisher_Db();
//
//        $log->save($fallo);
//        $db->save($fallo);
        return $fallo;
    }

    /**
     * Funcion usada para salvar las trazas de cierre de seccion.
     *
     * @param string $ipPc Ip de la PC cliente.
     * @param integer $categoria Identificador del subsistema donde se ejecuto la accion.
     * @param string $user Usuario autenticado.
     * @param integer $idestructura Identificador de la estructura donde se ejecuto la accion.
     *
     * @return ZendExt_Trace_Container_CierreSesion
     */
    public function traceCierreSesion($categoria, $user, $ippc, $idsession, $subsistema, $categoriar)
    {

        $traceCierreSesion = new ZendExt_Trace_Container_CierreSesion(
            $categoria, $user, $ippc, $idsession, $subsistema, $categoriar
        );
//        $log = new ZendExt_Trace_Publisher_Log();
//        $db = new ZendExt_Trace_Publisher_Db();
//        $log->save($traceCierreSesion);
//        $db->save($traceCierreSesion);
        return $traceCierreSesion;

    }

    /**
     * Funcion usada para salvar las trazas de Fallo de utorizcion.
     *
     * @param integer $categoria Identificador del subsistema donde se ejecuto la accion.
     * @param string $user Usuario autenticado.
     *
     * @return ZendExt_Trace_Container_FalloAutorizacion
     */
    public function traceAutoritationFaild($referencia, $user, $ippc, $idsession, $subsistema, $categoria)
    {

        $traceAutenticationFaild = new ZendExt_Trace_Container_FalloAutorizacion(
            $referencia, $user, $ippc, $idsession, $subsistema, $categoria
        );
        $log = new ZendExt_Trace_Publisher_Log();
        $db = new ZendExt_Trace_Publisher_Db();
        $log->save($traceAutenticationFaild);
        $db->save($traceAutenticationFaild);
        return $traceAutenticationFaild;
    }

    /**
     * Funcion usada para salvar las trazas de Autorizacion.
     *
     * @param integer $categoria Identificador del subsistema donde se ejecuto la accion.
     * @param string $user Usuario autenticado.
     * @param integer $idestructura Identificador de la estructura donde se ejecuto la accion.
     *
     * @return ZendExt_Trace_Container_Autorizacion
     */
    public function traceAutoritation($referencia, $user, $ippc, $idsession, $subsistema, $categoria)
    {

        $traceAutoritation = new ZendExt_Trace_Container_Autorizacion(
            $referencia, $user, $ippc, $idsession, $subsistema, $categoria
        );
//        $log = new ZendExt_Trace_Publisher_Log();
//        $db = new ZendExt_Trace_Publisher_Db();
//        $log->save($traceAutoritation);
//        $db->save($traceAutoritation);
        return $traceAutoritation;
    }

    /**
     * @param $tipo_bloqueo
     * @param $tipobloqueo
     * @param $categoria
     * @param $user
     * @param $ippc
     * @param $idsession
     * @param $subsistema
     * @param $categoriat
     * @return ZendExt_Trace_Container_Block
     */
    public function traceBlock($tipo_bloqueo, $tipoTrazaBloqueo, $referencia, $user, $ippc, $idsession, $subsistema)
    {

        $traceBlock = new ZendExt_Trace_Container_Block(
            $referencia, $user, $ippc, $idsession, $subsistema, $tipo_bloqueo, $tipoTrazaBloqueo, $tipoTrazaBloqueo
        );

//        $log = new ZendExt_Trace_Publisher_Log();
//        $db = new ZendExt_Trace_Publisher_Db();
//        $log->save($traceBlock);
//        $db->save($traceBlock);
        return $traceBlock;

    }

    /**
     * Funcion usada para salvar las trazas de Bloqueo.
     *
     * @param ZendExt_Trace_Container_Log $container Contenedor de una traza.
     * @return void
     */
    public function saveFromTree($container)
    {
        $log = new ZendExt_Trace_Publisher_Log();
        $db = new ZendExt_Trace_Publisher_Db();
        $log->save($container);
        $db->save($container, true);
    }
}
