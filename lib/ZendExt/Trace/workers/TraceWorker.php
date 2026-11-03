<?php

/**
 * Trabajador responsable de salvar las trazas de la aplicación.
 *
 * @package    ZendExt
 * @subpackage Trace
 * @author     Equipo de seguridad UCID.
 * @version    1.0
 */
class TraceWorker extends Amqp_Worker_Abstract {

    const BEGIN_TRACE = "ZendExt_Trace_Container_Action";
    const EXCEPTION_TRACE = "ZendExt_Trace_Container_Exception";
    const IOC_TRACE = "ZendExt_Trace_Container_IoC";
    const AUTHENTICATION_TRACE = "ZendExt_Trace_Container_Autentication";
    const FALLO_AUTHENTICATION_TRACE = "ZendExt_Trace_Container_FalloAutenticacion";
    const CIERRE_SESSION_TRACE = "ZendExt_Trace_Container_CierreSesion";
    const FALLO_AUTHORIZATION_TRACE = "ZendExt_Trace_Container_FalloAutorizacion";
    const AUTHORIZATION_TRACE = "ZendExt_Trace_Container_Autorizacion";
    const BLOQUEO_TRACE = "ZendExt_Trace_Container_Block";

    /**
     * work Realiza las tareas de salva de las trazas.
     *
     * @param array $args Arreglo de valores.
     *
     * @return void
     */
    public function work($args) {
        $log = new ZendExt_Trace_Publisher_Log();
        $db = new ZendExt_Trace_Publisher_Db();
        $bag = json_decode(base64_decode($args[0]));
        $haveAction = true;
        if($bag[0][0] != self::BEGIN_TRACE)
            $haveAction = false;
        $arrayOfContainer = array();
        // TODO Aplicar factory para la contruccion de las instancias en vez de un switch con sefl (ahorra mucho codigo y lo hace escalable)
        foreach($bag as $trace){
            switch ($trace[0]){
                case self::BEGIN_TRACE:
                        $traceContainer = new ZendExt_Trace_Container_Action(
                             $trace[2],$trace[1],$trace[3],$trace[4],$trace[5],$trace[6],$trace[7],$trace[8],$trace[9],
                            $trace[10],$trace[11]
                        );
                        if($haveAction)
                            $arrayOfContainer[0] = $traceContainer;
                        else
                            $arrayOfContainer[] = $traceContainer;
                    break;
                case self::EXCEPTION_TRACE:
                        $traceContainer = new ZendExt_Trace_Container_Exception(
                            $trace[1], $trace[2],$trace[3],$trace[4],$trace[5],$trace[6],$trace[7],$trace[8],$trace[9],
                            $trace[10],$trace[11],$trace[12]
                        );
                        if($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    break;
                case self::IOC_TRACE:
                        $traceContainer = new ZendExt_Trace_Container_IoC(
                            $trace[1], $trace[2],$trace[3],$trace[4],$trace[5],$trace[6],$trace[7],$trace[8],$trace[9],
                            $trace[10],$trace[11],$trace[12],$trace[13]
                        );
                        if($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    break;
                case self::AUTHENTICATION_TRACE:
                        $traceContainer =  new ZendExt_Trace_Container_Autentication(
                            $trace[1], $trace[2],$trace[3],$trace[4],$trace[5],$trace[6]
                        );
                        if($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    break;
                case self::FALLO_AUTHENTICATION_TRACE:
                        $traceContainer =  new ZendExt_Trace_Container_FalloAutenticacion(
                            $trace[1], $trace[2],$trace[3],$trace[4],$trace[5],$trace[6],$trace[7]
                        );
                        if($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    break;
                case self::CIERRE_SESSION_TRACE:
                        $traceContainer = new ZendExt_Trace_Container_CierreSesion(
                            $trace[1], $trace[2],$trace[3],$trace[4],$trace[5],$trace[6]
                        );
                        if($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    break;
                case self::FALLO_AUTHORIZATION_TRACE:
                        $traceContainer = new ZendExt_Trace_Container_FalloAutorizacion(
                            $trace[1], $trace[2],$trace[3],$trace[4],$trace[5],$trace[6]
                        );
                        if($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    break;
                case self::AUTHORIZATION_TRACE:
                        $traceContainer = new ZendExt_Trace_Container_Autorizacion(
                            $trace[1], $trace[2],$trace[3],$trace[4],$trace[5],$trace[6]
                        );
                        if($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    break;
                case self::BLOQUEO_TRACE:
                        $traceContainer = new ZendExt_Trace_Container_Block(
                            $trace[1], $trace[2],$trace[3],$trace[4],$trace[5],$trace[6],$trace[7],$trace[8]
                        );
                        if($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    break;
            }
        }
        foreach($arrayOfContainer as $container){
            $db->save($container,true);
            $log->save($container);
        }
    }

}
