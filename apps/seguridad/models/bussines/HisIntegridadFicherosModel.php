<?php

/**
 * Created by PhpStorm.
 * User: kmilo
 * Date: 7/6/2018
 * Time: 15:24
 */
class HisIntegridadFicherosModel extends ZendExt_Model
{

    public function HisIntegridadFicherosModel()
    {
        parent::ZendExt_Model();
    }


    public static function cargarDatosIniciales()
    {
        return Doctrine:: getTable('HisIntegridadficheros')->findOneByUltimoescaneo(true);
    }

    public static function cargarHistorial($pagina, $limite)
    {
        return HisIntegridadficheros::cargarHistorial($pagina, $limite);
    }

    /**
     * Realiza el chequeo de integridad de
     * Zeolides travéz de la herramienta AIDE
     * @method comprobarIntegridadAction
     *
     * @return array
     */
    public static function comprobar()
    {
        $respuesta = array();

        //comando que revisa la integridad
        exec('sudo /etc/cron.daily/aide', $output, $return);
        if (0 !== $return)
            throw new ZendExt_Exception('SEGINTEGRIDAD05');

        $resultadoChequeo = self::obtenerInformacionChequeo();
        $resultadoChequeo->escaneoautomatico = false;

        self::salvarChequeo($resultadoChequeo);
        $respuesta['datos'] = $resultadoChequeo->toArray();

        return $respuesta;
    }

    public static function ejecutarComprobacionAutomatica()
    {
        $config = self::cargarConfiguracion();
//        Solo si el escaneo se encuentra activado realizo las operaciones
        if ($config->escaneoActivo) {
            $ultimoChequeo = Doctrine:: getTable('HisIntegridadficheros')->findOneByUltimoescaneo(true);
            $fechaActual = new DateTime('now', new DateTimeZone('America/Havana'));
            $fechaUltimoChequeo = new DateTime($ultimoChequeo->fechaanalisis);
//        Como estandar A las 06:25 es la hora en la que se ejecutan las tareas programadas diarias
//        de los sistemas UNIX en el crontab por lo que espero 10 min más

            if ($fechaActual->format('H:i') > '06:35' &&
                ($fechaActual->format('Y-m-d') > $fechaUltimoChequeo->format('Y-m-d') ||
                    $ultimoChequeo == null
                )
            ) {

                if ($ultimoChequeo = self::obtenerInformacionChequeo()) {
                    $ultimoChequeo->escaneoautomatico = true;
                    self::salvarChequeo($ultimoChequeo);
                }
            }
        }
    }

    public static function cargarConfiguracion()
    {
        $register = Zend_Registry::getInstance();
        return new Zend_Config_Ini($register->config->security_config, 'fileIntegrity');
    }

    private function obtenerInformacionChequeo()
    {
        $resultadoChequeo = new HisIntegridadficheros();
//        Asumo que siempre se viola por defecto
        $resultadoChequeo->violacion = true;
        //        Comprobando el acceso de lectura a los logs
        $resultadoChequeo->log = file_get_contents('/var/log/aide/aide.log');
        if (!$resultadoChequeo->log || strlen($resultadoChequeo->log) === 0)
            throw new ZendExt_Exception('SEGINTEGRIDAD01');

//          Obteniendo la fecha y hora de la ejecución
        $resultadoChequeo->fechaanalisis = substr(explode('Start timestamp: ', $resultadoChequeo->log, 2)[1], 0, 19);

//          Verificando si existieron violaciones
        if (false === strpos($resultadoChequeo->log, "found differences between database and filesystem!!"))
            $resultadoChequeo->violacion = false;
        $resultadoChequeo->ultimoescaneo = true;

        return $resultadoChequeo;
    }

    private function salvarChequeo(HisIntegridadficheros $resultadoChequeo)
    {
        $ultimoEscaneo = Doctrine:: getTable('HisIntegridadFicheros')->findOneByUltimoescaneo(true);
        if ($ultimoEscaneo)
            $ultimoEscaneo->set('ultimoescaneo', false)->save();
        $resultadoChequeo->save();
    }


}