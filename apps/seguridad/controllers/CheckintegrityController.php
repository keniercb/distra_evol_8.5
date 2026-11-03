<?php

/**
 * @name CheckintegrityController - Clase controladora para
 * chequear integridad de Zeolides.
 * @package   seguridad
 * @copyright XETID
 * @author    Equipo HEDEXi.
 * @version   2.3-0
 */
class CheckintegrityController extends SeguridadController
{

    /**
     * @method init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    public function checkintegrityAction()
    {
        $this->render();
    }

    public function cargarDatosInicialesAction()
    {

        $datosIniciales = HisIntegridadFicherosModel::cargarDatosIniciales();

        if ($datosIniciales)
            $datosIniciales = $datosIniciales->toArray();

//       inyectando la información del AIDE
        $datosIniciales['estaInstaladoAIDE'] = self::estaInstaladoAIDE();

        $datosIniciales['escaneoActivo'] = HisIntegridadFicherosModel::cargarConfiguracion()->escaneoActivo;

        echo json_encode(array('datos' => $datosIniciales));
    }

    public function cargarHistorialAction()
    {

        $resultado = HisIntegridadFicherosModel::cargarHistorial(
            $this->_request->getPost('page'),
            $this->_request->getPost('limit'));
        echo json_encode(array(
            'datos' => $resultado['datos']->toArray(),
            'total' => $resultado['total']));
    }

    /**
     * Función principal de la clase,
     * encargada de renderizar la vista correspondiente.
     * @method checkintegrityAction()
     *
     * @return void
     */

    public function comprobarAction()
    {
        echo json_encode(HisIntegridadFicherosModel::comprobar());
    }

    /**
     * Funcion usada para saber si estan habilitados los mecanismos de
     * deteccion de cambios en la base de datos no procedentes del Marco de Trabajo.
     * @method estaHabilitadaDeteccionCambiosBDAction()
     *
     * @return array
     */
    public function estaHabilitadaDeteccionCambiosBDAction()
    {
        $resultado = DatBdModel::estaHabilitadaDeteccionCambiosBD();
        echo json_encode($resultado);
    }

    /**
     * Funcion usada para habilitar los mecanismos de
     * deteccion de cambios en la base de datos no procedentes del Marco de Trabajo.
     * @method habilitarDeteccionCambiosBDAction()
     *
     * @return array
     */
    public function habilitarDeteccionCambiosBDAction()
    {
        set_time_limit(600);
        $resultado = DatBdModel::habilitarDeteccionCambiosBD();
        echo json_encode($resultado);
    }

    /**
     * Funcion usada para deshabilitar los mecanismos de
     * deteccion de cambios en la base de datos no procedentes del Marco de Trabajo.
     * @method deshabilitarDeteccionCambiosBDAction()
     *
     * @return array
     */
    public function deshabilitarDeteccionCambiosBDAction()
    {
        set_time_limit(600);
        $resultado = DatBdModel::deshabilitarDeteccionCambiosBD();
        echo json_encode($resultado);
    }

    public static function ejecutarComprobacionAutomatica()
    {
        if (self::estaInstaladoAIDE())
            HisIntegridadFicherosModel::ejecutarComprobacionAutomatica();

    }

    public static function ejecutarAccionesAnteViolacion()
    {
        $config = HisIntegridadFicherosModel::cargarConfiguracion();
//        Solo si el escaneo se encuentra activado realizo las operaciones
        if ($config->escaneoActivo) {

            if ($config->invalidarSistema && HisIntegridadFicherosModel::cargarDatosIniciales()['violacion'])
                throw new ZendExt_Exception('SEGINTEGRIDAD02');
//            todo enviar notificaciones en caso de que que esté desactivado la invalidación del sistema
        }
    }

    public static function estaInstaladoAIDE()
    {
//      Sino se encuentra instalado
        exec("dpkg -s aide", $result);
        if (empty($result)) {
            return false;
        }
        return true;
    }


}
