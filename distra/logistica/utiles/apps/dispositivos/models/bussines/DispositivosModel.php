<?php

class DispositivosModel extends BaseModel
{

    private $_variablesModel;
    public function __construct()
    {
        parent::__construct();

        $this->_variablesModel = new VariablesGlobalesModel();
    }

    public function adicionarDispositivo()
    {
        $deviceId = DistraApiHelper::__init()->registerDevice();
        $semilla = date('d_m_Y');
        mkdir($_SERVER['DOCUMENT_ROOT'] . "/logistica/utiles/dispositivos/llaves", 0777, true);
        $ruta = $_SERVER['DOCUMENT_ROOT'] . "/logistica/utiles/dispositivos/llaves/{$deviceId}_{$semilla}.key";
        $rutaWeb = $_SERVER['HTTP_ORIGIN'] . "/logistica/utiles/dispositivos/llaves/{$deviceId}_{$semilla}.key";
        $keyFile = fopen($ruta, 'c+');
        $url = $this->_variablesModel->obtenerValor('API_URL');
        $user = $this->_variablesModel->obtenerValor('API_LOGIN_USER');
        $password = $this->_variablesModel->obtenerValor('API_LOGIN_PWD');
        $string = "SERVIDOR:{$url};" . PHP_EOL . "USUARIO:{$user};" . PHP_EOL . "PASSWORD:{$password};" . PHP_EOL . "KEY:{$deviceId};" . PHP_EOL;
        $string = LogisticaJWTHelper::__init()->encode($string);
        fwrite($keyFile, $string . ';');
        fclose($keyFile);
        $this->doctrineHelper->getConnection()->execute(
            "UPDATE mod_integracion.dat_dispositivo disp
            set idestructuracomun = {$this->global->Estructura->idestructura},
                llave = '{$rutaWeb}' 
            where disp.identificador = '{$deviceId}'"
        );
        return array('file' => $rutaWeb, 'creado' => true);
    }

    public function cargarDispositivos($parametros = array())
    {
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT disp.*, (est.codigo || ' ' ||est.denominacion) as almacen, COUNT(*) OVER() as total FROM mod_integracion.dat_dispositivo disp
            LEFT JOIN mod_estructuracomp.v_dametodasestructuras est on est.idestructura = disp.idalmacen
			WHERE disp.idestructuracomun = {$this->global->Estructura->idestructura} 
			order by disp.identificador"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function habilitar($parametros)
    {
        $value = ($parametros['accion'] == 1) ? 1 : 0;
        $ids = (count($parametros['dispositivos']) ? implode(',', $parametros['dispositivos']) : -1);
        return $this->doctrineHelper->getConnection()->fetchAll(
            "update mod_integracion.dat_dispositivo 
            set activo = {$value} where identificador in ({$ids})"
        );
    }

    public function cargarAlmacenes($params)
    {
        $filtro = $params['criterio'];
        $almacenes = $this->estructuraHelper->obtenerEstructurasNoFormales(
            $this->global->perfil->iddominio,
            $this->global->estructura->idestructura,
            $filtro,
            $params['limit'],
            $params['start']
        );
        foreach ($almacenes as &$almacen) {
            $almacen['denominacion'] = $almacen['DatEstructuraop'][0]['codigo'] . ' - ' . $almacen['text'];
            $almacen['iddeposito'] = $almacen['DatEstructuraop'][0]['idestructuraop'];
        }
        $total = count(
            $this->estructuraHelper->obtenerEstructurasNoFormales(
                $this->global->perfil->iddominio,
                $this->global->estructura->idestructura,
                $filtro
            )
        );
        return array('datos' => $almacenes, 'cantidad' => $total);
    }

    public function modificar($params)
    {
        if ($params['idalmacen'] && $params['identificador']) {
            return $this->doctrineHelper->getConnection()->fetchAll(
                "update mod_integracion.dat_dispositivo 
            set idalmacen = {$params['idalmacen']} where identificador = '{$params['identificador']}'"
            );
        }
        return false;
    }
}
