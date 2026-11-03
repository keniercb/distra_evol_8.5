<?php

/**
 * Clase de negocio de trazas.
 *
 * @author     Equipo de seguridad UCID.
 * @package    ZendExt.
 * @subpackage ZendExt_Trace.
 * @version    4.0
 */
class HisTrazaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function HisTrazaModel()
    {
        parent::ZendExt_Model();
    }

    public function saveTraza($extraData){
		try{
        $config = new Zend_Config_Xml(Zend_Registry::getInstance()->config->xml->modulesconfig,"traza_api");
        $curl = curl_init($config->toArray()['endpoint']);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);/** Autorizamos enviar datos*/
        $payload = json_encode(array(
            'cliente'=>$config->toArray()['client_id'],
            'usuario'=>$_SESSION['Zeolides']['perfil']['usuario'] ? : "Desconocido",
            'subsistema'=>$GLOBALS['module_reference'] ?: "Desconocido",
            'metodo'=>$_SERVER['REQUEST_METHOD'] ?: "Desconocido",
            'action'=>$_SERVER['HTTP_ORIGIN'].$_SERVER['REQUEST_URI'],
            'parametros'=>$_REQUEST,
            'ruta_modulo'=>$GLOBALS['config']['modulo_path'] ?: "Desconocida",
            'ip'=>$this->getRealIpAddr(),
            'sistemaoperativo'=>$_SERVER['HTTP_USER_AGENT'],
            'datosextras'=> $extraData
        ));
        curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
        curl_exec($curl);/** Ejecutamos petición*/
        curl_close($curl);
		}catch(Exception $e){
			
		}
    }
    function getRealIpAddr()
{
    $ip = array();
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
    {
     array_push( $ip,$_SERVER['HTTP_X_FORWARDED_FOR']);
    }
    if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
    {
      array_push($ip,$_SERVER['HTTP_CLIENT_IP']);
    }

    return implode(",",$ip);
}

    /**
     * Retorna los datos para cargar las graficas del reporte por categorias de trazas.
     * @method categoria
     *
     * @param array $array - Arreglo de valores enviados por GET o POST
     *
     * @return Json listado de cantidad de trazas por categoría
     */
    public static function categoria($array)
    {		
        $arrayCategorias = array();
        $arrayValores = array();
        $arrayFiltros = self::getFiltros($array);
        $datos = HisTraza::getGraficByCategory($arrayFiltros);
        foreach ($datos as $value) {
            array_push($arrayCategorias, $value['subsistema']);
            array_push($arrayValores, (int)$value['count']);
        }
        return json_encode(array('categoria' => $arrayCategorias, 'valores' => $arrayValores));
    }

    /**
     * Retorna los datos para cargar las graficas del reporte por fechas de trazas.
     * @method fecha
     *
     * @param array $array - Arreglo de valores enviados por GET o POST
     *
     * @return Json Listado de cantidad de trazas por fecha.
     */
    public static function fecha($array)
    {
        $arrayFechas = array();
        $arrayValores = array();
        $arrayFiltros = self::getFiltros($array);
        $datos = HisTraza::getGraficByDate($arrayFiltros);
        foreach ($datos as $value) {
            array_push($arrayFechas, (string)$value['fecha']);
            array_push($arrayValores, (int)$value['count']);
        }
        return json_encode(array('categoria' => $arrayFechas, 'valores' => $arrayValores));
    }

    /**
     * Retorna los datos para cargar las graficas del reporte por fechas de trazas.
     * @method usuario
     *
     * @param array $array - Arreglo de valores enviados por GET o POST
     *
     * @return Json Listado de cantidad de trazas por usuario.
     */
    public static function usuario($array)
    {
        $arrayFechas = array();
        $arrayValores = array();
        $arrayFiltros = self::getFiltros($array);
        $datos = HisTraza::getGraficByUser($arrayFiltros);
        foreach ($datos as $value) {
            array_push($arrayFechas, (string)$value['usuario']);
            array_push($arrayValores, (int)$value['count']);
        }
        return json_encode(array('categoria' => $arrayFechas, 'valores' => $arrayValores));
    }

    /**
     * Retorna los datos para cargar las graficas del reporte por fechas de trazas.
     * @method tipo
     *
     * @param array $array - Arreglo de valores enviados por GET o POST
     *
     * @return Json Listado de cantidad de trazas por tipos de trazas.
     */
    public static function tipo($array)
    {
        $arrayFechas = array();
        $arrayValores = array();
        $arrayFiltros = self::getFiltros($array);
        $datos = HisTraza::getGraficByTipe($arrayFiltros); 
        foreach ($datos as $value) {
            array_push($arrayFechas, (string)$value['tipotraza']);
            array_push($arrayValores, (int)$value['count']);
        }
        return json_encode(array('categoria' => $arrayFechas, 'valores' => $arrayValores));
    }

    public function getFiltros($array)
    {       
        $valores = array();
        $where = '';
       
        if (isset($array['campos']) && $array['campos'] != null) {
            $campos = json_decode(str_replace('\\', '', $array['campos']));
        }
        
         if ($array['fecha_desde'] != 0) {
                    $where .= 'm.fecha >= ?';
                    $valores[] = $array['fecha_desde'];
         }
         if ($array['fecha_hasta'] != 0) {
                    $where .= ' AND m.fecha <= ?';
                    $valores[] = $array['fecha_hasta'];
         }         
       
        return array('filtros' => $where, 'datos' => $valores /*,'join' => $join*/);
    }
    
    /**
     * Retorna la ultima traza de la categoria.
     * @method tipo
     *
     * @param  $categoria - Id de la categoria
     *
     * @return traza encontrada.
     */
    function getTraza($categoria,$idseccion,$referencia)
    {
        $query = Doctrine_Query :: create(HisTraza::getConn());
        $result = $query->select('rt.idtraza as idtraza')
                ->from('HisTraza rt')
                ->where('rt.idtipotraza = ? and rt.idseccion =?',array($categoria,$idseccion))
                ->orderBy('rt.idtraza DESC')
                ->fetchArray();
           
        return $result[0][idtraza];
    }
//  ->where('rt.idtipotraza =?,rt.idseccion =?,rt.referencia =?',$categoria,$idseccion,$referencia)
     /**
     * Retorna los usuarios con trazas.
     * @method getUserWithTraces
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTraces)
     * @return array Listado de usuarios.
     */
    public static function getUsersWithTraces($params)
    {
        $query = Doctrine_Query::create(HisTraza::getConn());
        $query->select('DISTINCT(t.usuario) usuario, t.usuario idusuario')
              ->from('HisTraza t');
        self::addConditionsTraces($query, $params);
        return $query->fetchArray();
    }
    /**
     * Retorna los ip con trazas.
     * @method getIpsWithTraces
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTracese)
     * @return array Listado de usuarios.
     */
    public static function getIpsWithTraces($params)
    {
        $query = Doctrine_Query::create(HisTraza::getConn());
        $query->select('DISTINCT(t.ippc) ippc, t.ippc ip')
              ->from('HisTraza t')
              ->orderBy('t.ippc');
        self::addConditionsTraces($query, $params);
        return $query->fetchArray();
    }

    /**
     * Retorna los subsistemas con trazas.
     * @method getSistemasWithTraces
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTracese)
     * @return array Listado de sistemas.
     */
    public static function getSistemsWithTraces($params)
    {
        $query = Doctrine_Query::create(HisTraza::getConn());
        $query->select('DISTINCT(t.subsistema) subsistema')
            ->from('HisTraza t')
            ->orderBy('t.subsistema');
        self::addConditionsTraces($query, $params);
        return $query->fetchArray();
    }

    /**
     * Retorna los usuarios con trazas para un arbol.
     * @method getUsersWithTracesTree
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTraces)
     * @return array Listado de usuarios.
     */
    public static function getUsersWithTracesTree($params)
    {

        /*$query = Doctrine_Query::create(HisTraza::getConn());
        $query->select("DISTINCT (t.usuario) as usuario, t.usuario as identidad, t.usuario as text")
              ->addSelect("'usuario' as tipo, 'col' as uiProvider")
              ->from('HisTraza t');
        self::addConditionsTracesTree($query, $params);
        //print_r($query->getSqlQuery());die;
        $r = $query->fetchArray();
        //print_r($r);die;
        return $r;*/


        $addWhere  = self::addWhere($params);

        $q = "SELECT t.usuario,	t.usuario as identidad, t.usuario as text,'usuario' as tipo, 'col' as uiProvider
              FROM 	mod_traza.his_traza t
              WHERE ";
        $q .= $addWhere?implode(" AND ",$addWhere):'';
        $q .= " group by t.usuario;";
//        print_r($q);die;
        $c = Doctrine_Manager::getInstance()->connection();
        $r = $c->execute($q)->fetchAll(Doctrine_Core::HYDRATE_RECORD);
        return $r;

    }


    public static function addWhere($params, $v = 't'){

        $arr = array();
        $arr[] = "{$v}.fecha BETWEEN '{$params['fechainicio']}' AND '{$params['fechafin']}'";

        switch($params['tipo']){
            case "usuario":{
                $arr[] = "{$v}.usuario = '{$params['value']}'";
            }break;
            case "sesion":{
                $arr[] = "{$v}.idseccion = '{$params['value']}'";

                //if($params['usuario_sesion']!='anonimo')
                $arr[] = "{$v}.usuario='{$params['usuario_sesion']}'";
                /*if(!$params['val']){
                    //$arr[] = "{$v}.idtrazapadre is null";
                }*/
            }break;
            case "trace":{
                //$arr[] = "{$v}.idtrazapadre='{$params['value']}'";
                $arr[] = "{$v}.idseccion='{$params['idseccion']}'";
                $arr[] = "{$v}.usuario='{$params['usuario_sesion']}'";
            }break;
        }

        if($sub = $params['idcategoriatraza']){
            $arr[] = "{$v}.subsistema = '{$sub}'";
        }
        if($ip = $params['ippc']){
            $arr[] = "{$v}.ippc = '{$ip}'";
        }
        if($usr = implode("','",$params['usuario'])){
            $arr[] =" {$v}.usuario IN ('{$usr}')";
        }
        if($idtt = implode("','",$params['idtipotraza'])){
            $arr[] = "{$v}.idtipotraza IN ('{$idtt}')";
//            if($params['tipo']=="sesion"&&!$params['val']){
//                $arr[] = "idtipotraza IN ('{$idtt}')";
//                //$pAux = $params;
//               // $pAux['val'] = true;
//               /// $aux = self::addWhere($pAux,'hij');
//                //print_r($aux);die("    XXX");
//                //$aux = implode(' AND ',$aux);
//                //print_r($aux);die("    XXX");
//                /*$arr[] = "((t.idtraza in (Select hij.idtrazapadre from mod_traza.his_traza hij where {$aux} and hij.idtipotraza IN ('{$idtt}') and hij.idtrazapadre is not null))".
//                     " OR (t.idtraza in (Select hij.idtraza from mod_traza.his_traza hij where {$aux} and hij.idtipotraza IN ('{$idtt}') and hij.idtrazapadre is null)))";*/
//                /*$arr[] = "(((Select count(*) from mod_traza.his_traza hij where {$aux} and hij.idtipotraza IN ('{$idtt}') and hij.idtrazapadre is not null)>0)".
//                     " OR (t.idtraza in (Select hij.idtraza from mod_traza.his_traza hij where {$aux} and hij.idtipotraza IN ('{$idtt}') and hij.idtrazapadre is null)))";*/
//                /*print_r($arr);*/
//            }
////            else if($params['tipo']=="trace"&&!$params['val']){
////                $pAux = $params;
////                $pAux['val'] = true;
////                $aux = self::addWhere($pAux,'hij');
////                //print_r($aux);die("    XXX");
////                //$aux = implode(' AND ',$aux);
////                //print_r($aux);die("    XXX");
////                /*$arr[] = "((t.idtraza in (Select hij.idtrazapadre from mod_traza.his_traza hij where {$aux} and hij.idtipotraza IN ('{$idtt}') and hij.idtrazapadre is not null))".
////                     " OR (t.idtraza in (Select hij.idtraza from mod_traza.his_traza hij where {$aux} and hij.idtipotraza IN ('{$idtt}') and hij.idtrazapadre is null)))";*/
////                /*$arr[] = "(((Select count(*) from mod_traza.his_traza hij where {$aux} and hij.idtipotraza IN ('{$idtt}'))>0)".
////                     " OR (t.idtraza in (Select hij.idtraza from mod_traza.his_traza hij where {$aux} and hij.idtipotraza IN ('{$idtt}'))))";*/
////                /*print_r($arr);*/
////            }
//            else if($params['tipo']!="sesion"){
//                $arr[] =" {$v}.idtipotraza IN ('{$idtt}')";
//            }
            /*print_r($arr);
            print_r("   \n.......................................................");*/
        }
        /*print_r("   \n*************************************************************");
        print_r($arr);
        print_r("\n<<<<<<*");print_r(count($arr));print_r("<<<<<<*");
        print_r("   \n*************************************************************");*/
        return count($arr)>0? $arr: false;

    }

    /**
     * Obtener los usuarios con sessiones
     * @method getUsersWithSessions
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTracesTree)
     * @return {Array} Listado de usuarios con sesiones.
     */
    public static function getUsersWithSessions($params){
        $usuarios_con_sesiones = array();
        $usuarios= self::getUsersWithTracesTree($params);
        foreach($usuarios as $user){
            $new_params =$params;
            $new_params['tipo']=  'usuario';
            $new_params['value']= $user['identidad'];
            if(self::hasSesionUsers($new_params)){
                $usuarios_con_sesiones[] = $user;
            }
        }
        //print_r($usuarios_con_sesiones);die;
        return $usuarios_con_sesiones;
    }


    /**
     * Retorna todas las sesiones que cumplen con los parametros de busqueda para el arbol.
     * @method getAllSesionsWithTracesTree
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTracesTree)
     * @return {Array} Listado de sesiones.
     */
    public static function getAllSesionsWithTracesTree($params)
    {
        /*$query = Doctrine_Query::create(HisTraza::getConn());
        $query->select("t.idseccion AS session,
	                    t.idseccion AS identidad,
	                    t.ippc AS text,
	                    MIN(t.fecha) as fecha,
	                    MIN(t.hora) AS hora,
	                    'col' as uiProvider,
	                    'sesion' AS tipo,
	                    t.usuario AS usuario_sesion")
            ->from('HisTraza t')
            ->groupBy('t.idseccion, t.usuario, t.ippc, t.fecha, t.hora')
            ->orderBy('t.fecha,t.hora ASC');
            self::addConditionsTracesTree($query, $params);
        //print_r($query->getSqlQuery($params));die;
        return $query->fetchArray();*/
        $addWhere  = self::addWhere($params);

        $q = "SELECT t.idseccion AS session,
                    t.idseccion AS identidad,
                    t.fecha,
                    (case when t.ippc is not null then 'Sesion del ip: '||t.ippc else 'Ip no resgistrado' end) AS text,
                    'col' as uiProvider,
                    'sesion' AS tipo,
                    t.usuario AS usuario_sesion
              FROM 	mod_traza.his_traza t
              WHERE ";
        $q .= $addWhere?implode(" AND ",$addWhere):'';
        $q .= " group by t.idseccion,t.fecha, t.usuario, t.ippc;";
        /*print_r($q);die;*/
        $c = Doctrine_Manager::getInstance()->connection();
        $r = $c->execute($q)->fetchAll(Doctrine_Core::HYDRATE_RECORD);
        foreach ($r as &$trace) {
            unset($trace['uiprovider']);
            $trace['uiProvider'] = 'col';
        }
        return $r;
    }

    /**
     * Obtener las sesiones con trazas
     * @method getSesionsWithTracesTree
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTracesTree)
     * @return {Array} Listado de sesiones con trazas.
     */
    public static function getSesionsWithTracesTree($params){
        /*$sesiones_con_trazas = array();
        $sesiones = self::getAllSesionsWithTracesTree($params);

        $sesiones_sin_repetirse = self::orderSessionWithTraces($sesiones);
            foreach($sesiones_sin_repetirse as $sesion){
                if(self::hasTracesSesion($params, $sesion['session'])){
                    $s = $sesion;
                    $s['text'] = $sesion['text'] ? 'Sesion del ip:'.$sesion['text'] : 'Ip no resgistrado';
                    $sesiones_con_trazas[] = $s;
                }
            }
       return $sesiones_con_trazas;*/
        return self::getAllSesionsWithTracesTree($params);

    }

    public static function orderSessionWithTraces($sessions){
        $sesiones = array();
        foreach($sessions as $session){
            if($sesiones[$session['session']] == null){
                $sesiones[$session['session']] = $session;
            }

        }
        return array_values($sesiones);
    }
    /**
     * Retorna la cantidad de trazas de una session que los tipotraza sean (1= "Acción", 3= "Excepción",7= "Fallo de autorización",10= "Dato")
     * y que no tengan padre
     * @method findCountTracesSesion
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTracesTree)
     * @idsesion {Integer} -- Id de la sesion de las trazas a buscar
     *
*@return {Integer} Cantidad de trazas de la session.
     */
    public static function findCountTracesSesion(&$params, $idsesion)
    {
        $newparams = $params;
        $newparams['tipo'] = 'sesion';
        $newparams['value'] = $idsesion;
        $query = Doctrine_Query::create(HisTraza::getConn())
              ->from('HisTraza t')
              ->where('t.usuario = ?', $params['value']);
        self::addConditionsTracesTree($query,$newparams);
        return $query->count();
    }

    public static function findCountSesionUsers(&$params)
    {       $query = Doctrine_Query::create(HisTraza::getConn())
            ->from('HisTraza t');
        self::addConditionsTracesTree($query, $params);
//        print_r($query->getSqlQuery());die;
        return $query->count();

    }
    /**
     * Retorna verdadero o falso si la sesion tiene trazas
     * @method hasTracesSesion
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTracesTree)
     * @idsesion {Integer} -- Id de la sesion de las trazas a buscar
     * @return {Boolean} True si la sesion tiene trazas.
     */
    public static function hasTracesSesion($params, $idsesion){
        return self::findCountTracesSesion($params, $idsesion) > 0;
    }

    public static function hasSesionUsers($params){
        return self::findCountSesionUsers($params) > 0;
    }
    /**
     * Retorna las trazas de las sesiones con trazas para un arbol.
     * @method getTracesTree
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTracesTree)
     * @return {Array} Listado de trazas.
     */
    public static function getTracesTree($params)
    {

        $query = Doctrine_Query::create(HisTraza::getConn());
        $query->select("*,t.idtraza,t.idtraza as identidad,t.subsistema as subsistema, t.referencia, t.fecha, t.hora, t.usuario as usuario_sesion")
            ->addSelect("ha.descripcion as descripcion_accion,ha.controlador as funcionalidad_accion, ha.accion as accion, ha.tiempoejecucion as tiempoejecucion_accion, ha.memoria as memoria_accion")
            ->addSelect("nt.tipotraza as tipotraza")
            ->addSelect("hexec.codigo as codigo_excepcion")
            ->addSelect("hinteg.origen as origen_integracion,hinteg.clase as funcionalidad_integracion, hinteg.destino as destino_integracion, hinteg.metodo as metodo_integracion, hinteg.tiempoejecucion as tiempoejecucion_integracion, hinteg.memoria as memoria_integracion")
            ->addSelect("hd.esquema||'-'||hd.tabla as descripcion_dato, hd.idoperacion as idoperacion_dato")
            ->addSelect("'trace' as tipo,
                               (case when t.idtipotraza='1' then 'area' else
                                case when t.idtipotraza='2' then 'cerrar' else
                                case when t.idtipotraza='3' then 'entidad' else
                                case when t.idtipotraza='4' then 'deshabilitar' else
                                case when t.idtipotraza='5' then 'aceptar' else
                                case when t.idtipotraza='6' then 'ajustar' else
                                case when t.idtipotraza='7' then 'cerrar' else
                                case when t.idtipotraza='8' then 'seguridad' else
                                case when t.idtipotraza='9' then 'salir' else 'medios'
                                end end end end end end end end end) as iconCls, 'col' as uiProvider")
            ->from('HisTraza t')
            ->leftJoin('t.HisAccion ha')
            ->leftJoin('t.HisFalloAutenticacion fa')
            ->leftJoin('t.HisDato hd')
            ->leftJoin('t.HisBloqueo hb')
            ->leftJoin('t.HisExcepcion hexec')
            ->leftJoin('t.HisIoc hinteg')
            ->innerJoin('t.NomTipotraza nt')
            ->orderBy('idtraza ASC');
        self::addConditionsTracesTree($query, $params);
        return $query->fetchArray();
    }
    /*
     * Obtener arreglo de trazas listas para mostrar en el arbol
     * @method getTracesArrayTree
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTracesTree)
     * @return {Array} Listado de trazas.
     */
    public static function getTracesArrayTreeSesion($params)
    {
        //$traces = self::getTracesTree($params);
        $traces = self::getTraceTreeOtro($params);

        //echo "<pre>";print_r($traces);die;
        foreach ($traces as &$trace) {
            $p = $params;
            $p['idseccion'] = $p['value'];
            $p['value'] = $trace['idtraza'];
            $p['tipo'] = "trace";
            $t = self::getTraceTreeOtroTrace($p);

            $trace['leaf']  = !count($t);
            if($trace['idtipotraza']== 10) {
                    $operaciones= array('Inserci&oacute;n','Modificaci&oacute;n','Eliminaci&oacute;n');
                    $trace['text'] = $operaciones[$trace['idoperacion_dato']-1].':'.$trace['descripcion_dato'];

            }else if($trace['idtipotraza']== 6) {
                $trace['text'] = 'Se consume el servicio:'.$trace['metodo_integracion'] ;
            }else if($trace['idtipotraza']== 1){
                $trace['text'] = $trace['descripcion_accion'] != '' ? $trace['descripcion_accion']:'Acci&oacute;n ejecutada:'.$trace['accion'];
            }else if($trace['idtipotraza']== 3){
                $trace['text'] = 'Excepci&oacute;n:'.$trace['codigo_excepcion'] ;
            }else
           $trace['text'] = $trace['accion'] != '' ? $trace['accion'] : $trace['tipotraza'];
            $referencia=explode('http://',$trace['referencia']);
           $trace['qtip'] = $referencia[1];
            unset($trace['uiprovider']);
            $trace['uiProvider'] = 'col';
            $trace['iconCls'] = $trace['iconcls'];
            unset($trace['iconcls']);
        }
        return $traces;
    }

    public static function getTracesArrayTreeTrace($params)
    {
        //$traces = self::getTracesTree($params);
        $traces = self::getTraceTreeOtroTrace($params);
        //echo "<pre>";print_r($traces);die;
        foreach ($traces as &$trace) {
            //$trace['leaf']  = !self::hasChildTrace($trace['idtraza']);
            $params['value'] = $trace['idtraza'];
            $trace['leaf']  = !count(self::getTraceTreeOtroTrace($params));

            if($trace['idtipotraza']== 10) {
                    $operaciones= array('Inserci&oacute;n','Modificaci&oacute;n','Eliminaci&oacute;n');
                    $trace['text'] = $operaciones[$trace['idoperacion_dato']-1].':'.$trace['descripcion_dato'];

            }else if($trace['idtipotraza']== 6) {
                $trace['text'] = 'Se consume el servicio:'.$trace['metodo_integracion'] ;
            }else if($trace['idtipotraza']== 1){
                $trace['text'] = $trace['descripcion_accion'] != '' ? $trace['descripcion_accion']:'Acci&oacute;n ejecutada:'.$trace['accion'];
            }else if($trace['idtipotraza']== 3){
                $trace['text'] = 'Excepci&oacute;n:'.$trace['codigo_excepcion'] ;
            }else
           $trace['text'] = $trace['accion'] != '' ? $trace['accion'] : $trace['tipotraza'];
            $referencia=explode('http://',$trace['referencia']);
           $trace['qtip'] = $referencia[1];
            unset($trace['uiprovider']);
            $trace['uiProvider'] = 'col';
            $trace['iconCls'] = $trace['iconcls'];
            unset($trace['iconcls']);
        }
        return $traces;
    }

    public static function mepaso($addWhere,$arrPadresNoNulos,$arrPadresNulos, $params = false){
        if(count($arrPadresNoNulos)==0){
            $stdClass = new stdClass();
            $stdClass->padresNoNulos =$arrPadresNoNulos;
            $stdClass->padresNulos =$arrPadresNulos;
            return $stdClass;
        }

        $q = "Select distinct t.idtrazapadre,  t.idtraza, tp.idtrazapadre padre FROM mod_traza.his_traza t
                     right join mod_traza.his_traza tp ON ";
        $q .= $params?' t.idtrazapadre=tp.idtraza':' (t.idtrazapadre=tp.idtraza OR tp.idtrazapadre is null)';
        /*print_r($addWhere);die;*/
        $q .=" WHERE ";
        $q .= $addWhere?implode(" AND ",$addWhere):'';
        $idst = implode("','",$arrPadresNoNulos);
        $q.= " and t.idtraza in ('{$idst}')";
        /*print_r($q);die;*/
        $c = Doctrine_Manager::getInstance()->connection();
        $r = $c->execute($q)->fetchAll(Doctrine_Core::HYDRATE_RECORD);
//        print_r($q);print_r($r);die;
        $arrPadresNoNulosAux = $arrPadresNoNulos;
        $arrPadresNoNulos = array();
        /*print_r("\n...........AUX......................");
        print_r($arrPadresNoNulosAux);
        print_r("\n........................................");
        print_r("\n...........PADRESNULOS......................");
        print_r($arrPadresNulos);
        print_r("\n........................................");
        print_r("\n...........PADRESNONULOS......................");
        print_r($arrPadresNoNulos);
        print_r("\n........................................");
        print_r($q);
        print_r("\n........................................");
        print_r($r);die;*/
        if($params){
            foreach($r as $idsThp ) {
                    if($idsThp['idtrazapadre']== $params['value']&& !in_array($idsThp['idtraza'],$arrPadresNulos)){
                        $arrPadresNulos[] =$idsThp['idtraza'];
                    }
                    else if($idsThp['idtrazapadre']!= $params['value']&& !in_array($idsThp['idtrazapadre'],$arrPadresNoNulosAux)){
                        $arrPadresNoNulos [] = $idsThp['idtrazapadre'];
                    }
            }
        }
        else{
            foreach($r as $idsThp ) {
                /*print_r($idsThp);*/
                if(!$idsThp['padre']&&!$idsThp['idtrazapadre']&& !in_array($idsThp['idtraza'],$arrPadresNulos)){

                    $arrPadresNulos[] =$idsThp['idtraza'];
                    /*print_r("______________________1________________________________\n");
                    print_r($arrPadresNulos);
                    print_r("_______________________________________________________\n");*/
                }
                else if(!$idsThp['padre']&&$idsThp['idtrazapadre']&& !in_array($idsThp['idtrazapadre'],$arrPadresNulos)){
                    $arrPadresNulos[] =$idsThp['idtrazapadre'];
                    /*print_r("_______________________2_______________________________\n");
                    print_r($arrPadresNulos);
                    print_r("_______________________________________________________\n");*/
                }
                else if($idsThp['padre']&& !in_array($idsThp['padre'],$arrPadresNoNulosAux)){
                    $arrPadresNoNulos [] = $idsThp['padre'];
                    /*print_r("________________________3______________________________\n");
                    print_r($arrPadresNulos);
                    print_r("_______________________________________________________\n");*/
                }
            }
        }
        /*print_r("\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");*/
        /*print_r("\n...........AUX......................");
        print_r($arrPadresNoNulosAux);
        print_r("\n........................................");
        print_r("\n...........PADRESNULOS......................");
        print_r($arrPadresNulos);
        print_r("\n........................................");
        print_r("\n...........PADRESNONULOS......................");
        print_r($arrPadresNoNulos);
        print_r("\n........................................");
        print_r($q);
        print_r("\n........................................");
        print_r($r);die;*/
        return self::mepaso($addWhere,$arrPadresNoNulos,$arrPadresNulos, $params);
    }

    public static function getTraceTreeOtroTrace($params){

        //print_r(self::addWhere($params));die;
        if(count($params['idtipotraza'])==0){
            $params['idtipotraza'] = array(1,2,3,4,5,6,7,8,9,10);
        }

        $addWhere  = self::addWhere($params);

        $qt = "SELECT
                    t.idtraza,
                    t.fecha,
                    t.hora,
                    t.idtrazapadre as idtrazapadre,
                    t.idtipotraza as idtipotraza,
                    t.usuario as usuario,
                    t.referencia,
                    t.idseccion as idseccion,
                    t.idcategoriatraza,
                    t.ippc,
                    t.subsistema as subsistema,
                    t.idtraza as identidad,
                    t.subsistema as text,
                    t.usuario as usuario_sesion,
                    ha.descripcion as descripcion_accion,
                    ha.controlador as funcionalidad_accion,
                    ha.accion as accion,
                    ha.tiempoejecucion as tiempoejecucion_accion,
                    ha.memoria as memoria_accion,
                    nt.tipotraza as tipotraza,
                    hexec.codigo as codigo_excepcion,
                    hinteg.origen as origen_integracion,
                    hinteg.clase as funcionalidad_integracion,
                    hinteg.destino as destino_integracion,
                    hinteg.metodo as metodo_integracion,
                    hinteg.tiempoejecucion as tiempoejecucion_integracion,
                    hinteg.memoria as memoria_integracion,
                    hd.esquema||'-'||hd.tabla as descripcion_dato,
                    hd.idoperacion as idoperacion_dato,
                    'trace' as tipo,
                    (
                        case when t.idtipotraza='1' then 'area' else
                                case when t.idtipotraza='2' then 'cerrar' else
                                case when t.idtipotraza='3' then 'entidad' else
                                case when t.idtipotraza='4' then 'deshabilitar' else
                                case when t.idtipotraza='5' then 'aceptar' else
                                case when t.idtipotraza='6' then 'ajustar' else
                                case when t.idtipotraza='7' then 'cerrar' else
                                case when t.idtipotraza='8' then 'seguridad' else
                                case when t.idtipotraza='9' then 'salir' else 'medios'
                                end end end end end end end end end) as iconCls,
                        'col' as uiProvider
                FROM
                    mod_traza.his_traza t
                LEFT JOIN
                    mod_traza.his_accion ha ON t.idtraza =ha.idtraza
                LEFT JOIN
                    mod_traza.his_falloautenticacion fa ON t.idtraza = fa.idtraza
                LEFT JOIN
                    mod_traza.his_dato hd ON t.idtraza = hd.idtraza
                LEFT JOIN
                    mod_traza.his_bloqueo hb ON t.idtraza = hb.idtraza
                LEFT JOIN
                    mod_traza.his_excepcion hexec ON t.idtraza = hexec.idtraza
                LEFT JOIN
                    mod_traza.his_integracion hinteg ON t.idtraza = hinteg.idtraza
                INNER JOIN
                    mod_traza.nom_tipotraza nt ON t.idtipotraza = nt.idtipotraza
              WHERE ";



            $q = "Select
                        distinct t.idtrazapadre,  t.idtraza
                    FROM
                        mod_traza.his_traza t
                    WHERE ";
            $q .= $addWhere?implode(" AND ",$addWhere):'';
            $q.=" and t.idtrazapadre is not null;";
            $c = Doctrine_Manager::getInstance()->connection();
            $r = $c->execute($q)->fetchAll(Doctrine_Core::HYDRATE_RECORD);

//            print_r($q);print_r($r);die;
            $arrPadresNulos = array();
            $arrPadresNoNulos = array();
            $arrPadresNoNulosAux = array();
            foreach($r as $idsThp ) {
                if($idsThp['idtrazapadre']== $params['value']){
                    $arrPadresNulos[] =$idsThp['idtraza'];
                }
                else if($idsThp['idtrazapadre']!= $params['value']&&!in_array($idsThp['idtrazapadre'],$arrPadresNoNulos)){
                    $arrPadresNoNulos [] = $idsThp['idtrazapadre'];
                }
            }

            array_pop($addWhere);


            /*print_r("\n\n\n...........ADDWHERE......................");
            print_r($addWhere);
            print_r("\n........................................");
            print_r("\n...........PADRESNULOS......................");
            print_r($arrPadresNulos);
            print_r("\n........................................");
            print_r("\n...........PADRESNONULOS......................");
            print_r($arrPadresNoNulos);
            print_r("\n........................................");
            print_r($q);
            print_r("\n........................................");
            //print_r($r);
            die;*/


            $response = self::mepaso($addWhere,$arrPadresNoNulos,$arrPadresNulos,$params);


            /*print_r("\n\n\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n");
            print_r($response);
            print_r("\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n\n\n");

            print_r("\n\n\n...........ADDWHERE......................");
            print_r($addWhere);
            print_r("\n........................................");
            print_r("\n...........PADRESNULOS......................");
            print_r($arrPadresNulos);
            print_r("\n........................................");
            print_r("\n...........PADRESNONULOS......................");
            print_r($arrPadresNoNulos);
            print_r("\n........................................");
            print_r($q);
            print_r("\n........................................");
            print_r($r);die;*/
            $arrPadresNulos=array_merge($arrPadresNulos,$response->padresNulos);
            if(count($arrPadresNulos)==0){
                return array();
            }

            $q = $qt;
            $ids = implode("','",$arrPadresNulos);
            $q.= " t.idtraza in('{$ids}') ";
            /*print_r($q);die;*/


        /*else{
            $q = $qt;
            $q .= $addWhere?implode(" AND ",$addWhere):'';
            $q .= " and t.idtipotraza IN ('1','2','3','4','5','6','7','8','9','10')";
        } */
        $q .= " ORDER BY t.idtraza ASC;";
//        print_r($q);die;
        $c = Doctrine_Manager::getInstance()->connection();
        $r = $c->execute($q)->fetchAll(Doctrine_Core::HYDRATE_RECORD);
        /*print_r($q);
        print_r($r);die;*/
        //print_r("\n<<<<<<*");print_r($r);print_r("<<<<<<*");die;
        return $r;
    }

    public static function getTraceTreeOtro($params){//Caso Session

        //print_r(self::addWhere($params));die;
        $addWhere  = self::addWhere($params);

        $qt = "SELECT
                    t.idtraza,
                    t.fecha,
                    t.hora,
                    t.idtrazapadre as idtrazapadre,
                    t.idtipotraza as idtipotraza,
                    t.usuario as usuario,
                    t.referencia,
                    t.idseccion as idseccion,
                    t.idcategoriatraza,
                    t.ippc,
                    t.subsistema as subsistema,
                    t.idtraza as identidad,
                    t.subsistema as text,
                    t.usuario as usuario_sesion,
                    ha.descripcion as descripcion_accion,
                    ha.controlador as funcionalidad_accion,
                    ha.accion as accion,
                    ha.tiempoejecucion as tiempoejecucion_accion,
                    ha.memoria as memoria_accion,
                    nt.tipotraza as tipotraza,
                    hexec.codigo as codigo_excepcion,
                    hinteg.origen as origen_integracion,
                    hinteg.clase as funcionalidad_integracion,
                    hinteg.destino as destino_integracion,
                    hinteg.metodo as metodo_integracion,
                    hinteg.tiempoejecucion as tiempoejecucion_integracion,
                    hinteg.memoria as memoria_integracion,
                    hd.esquema||'-'||hd.tabla as descripcion_dato,
                    hd.idoperacion as idoperacion_dato,
                    'trace' as tipo,
                    (
                        case when t.idtipotraza='1' then 'area' else
                                case when t.idtipotraza='2' then 'cerrar' else
                                case when t.idtipotraza='3' then 'entidad' else
                                case when t.idtipotraza='4' then 'deshabilitar' else
                                case when t.idtipotraza='5' then 'aceptar' else
                                case when t.idtipotraza='6' then 'ajustar' else
                                case when t.idtipotraza='7' then 'cerrar' else
                                case when t.idtipotraza='8' then 'seguridad' else
                                case when t.idtipotraza='9' then 'salir' else 'medios'
                                end end end end end end end end end) as iconCls,
                        'col' as uiProvider
                FROM
                    mod_traza.his_traza t
                LEFT JOIN
                    mod_traza.his_accion ha ON t.idtraza =ha.idtraza
                LEFT JOIN
                    mod_traza.his_falloautenticacion fa ON t.idtraza = fa.idtraza
                LEFT JOIN
                    mod_traza.his_dato hd ON t.idtraza = hd.idtraza
                LEFT JOIN
                    mod_traza.his_bloqueo hb ON t.idtraza = hb.idtraza
                LEFT JOIN
                    mod_traza.his_excepcion hexec ON t.idtraza = hexec.idtraza
                LEFT JOIN
                    mod_traza.his_integracion hinteg ON t.idtraza = hinteg.idtraza
                INNER JOIN
                    mod_traza.nom_tipotraza nt ON t.idtipotraza = nt.idtipotraza
              WHERE ";

        if(count($params['idtipotraza'])>0){
            $q = "Select
                        distinct t.idtrazapadre,  t.idtraza
                    FROM
                        mod_traza.his_traza t
                    WHERE ";
            $q .= $addWhere?implode(" AND ",$addWhere):'';
            $c = Doctrine_Manager::getInstance()->connection();
            $r = $c->execute($q)->fetchAll(Doctrine_Core::HYDRATE_RECORD);

//            print_r($q);print_r($r);die;
            $arrPadresNulos = array();
            $arrPadresNoNulos = array();
            $arrPadresNoNulosAux = array();
            foreach($r as $idsThp ) {
                if(!$idsThp['idtrazapadre']/*&& !in_array($idsThp['idtraza'],$arrPadresNulos)*/){
                    $arrPadresNulos[] =$idsThp['idtraza'];
                }
                else if($idsThp['idtrazapadre']&&!in_array($idsThp['idtrazapadre'],$arrPadresNoNulos)){
                    $arrPadresNoNulos [] = $idsThp['idtrazapadre'];
                }
            }

            array_pop($addWhere);


            /*print_r("\n\n\n...........ADDWHERE......................");
            print_r($addWhere);
            print_r("\n........................................");
            print_r("\n...........PADRESNULOS......................");
            print_r($arrPadresNulos);
            print_r("\n........................................");
            print_r("\n...........PADRESNONULOS......................");
            print_r($arrPadresNoNulos);
            print_r("\n........................................");
            print_r($q);
            print_r("\n........................................");
            print_r($r);die;*/
            $response = self::mepaso($addWhere,$arrPadresNoNulos,$arrPadresNulos);

            /*print_r("\n\n\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n");
            print_r($response);
            print_r("\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n\n\n");

            print_r("\n\n\n...........ADDWHERE......................");
            print_r($addWhere);
            print_r("\n........................................");
            print_r("\n...........PADRESNULOS......................");
            print_r($arrPadresNulos);
            print_r("\n........................................");
            print_r("\n...........PADRESNONULOS......................");
            print_r($arrPadresNoNulos);
            print_r("\n........................................");
            print_r($q);
            print_r("\n........................................");
            print_r($r);die;*/
            $arrPadresNulos=array_merge($arrPadresNulos,$response->padresNulos);
            if(count($arrPadresNulos)==0){
                return array();
            }

            $q = $qt;
            $ids = implode("','",$arrPadresNulos);
            $q.= "t.idtraza in('{$ids}') ORDER BY t.idtraza ASC;";
            /*print_r($q);die;*/

        }
        else{
            $q = $qt;
            $q .= $addWhere?implode(" AND ",$addWhere):'';
            $q .= ' and t.idtrazapadre is null';
            $q .= " ORDER BY t.idtraza ASC;";
        }

        //print_r($q);die;
        $c = Doctrine_Manager::getInstance()->connection();
        $r = $c->execute($q)->fetchAll(Doctrine_Core::HYDRATE_RECORD);
        /*print_r($q);
        print_r($r);die;*/
        //print_r("\n<<<<<<*");print_r($r);print_r("<<<<<<*");die;
        return $r;
    }

    /**
     * Retorna la cantidad de trazas hijas de una traza dado un idtrazapadre
     * @method findCountTracesChild
     * @params {Integer} $idtrazapadre -- Id de la traza de la cual se buscaran las trazas hijas
     * @return {Integer} Cantidad de trazas hijas de una traza.
     */
    public static function findCountTracesChild($idtrazapadre)
    {
        $query = Doctrine_Query::create(HisTraza::getConn())
            ->from('HisTraza t')
            ->where("t.idtrazapadre = ?", $idtrazapadre);
        return $query->count();
    }
    /**
     * Retorna la verdadero o falso si la traza tiene trazas hijas dado un idtrazapadre
     * @method hasChildTrace
     * @params {Integer} $idtrazapadre -- Id de la traza de la cual se buscaran las trazas hijas
     * @return {Boolean} True si la traza tiene hijas.
     */
    public static function hasChildTrace($idtrazapadre)
    {
        return self::findCountTracesChild($idtrazapadre) > 0;
    }

    /**
     * Retorna las trazas filtrando por params si params es vacio las devuelve todas.
     * @method findTraces
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTraces)
     * @return {Array} Listado de trazas.
     */
    public static function findTraces($params)
    {
       $query = Doctrine_Query::create(HisTraza::getConn());
        $query->select("*, nt.tipotraza tipotraza, nct.denominacion categoria, t.ippc||'--'||t.fecha ip_fecha")
            ->addSelect("ha.descripcion as descripcion_accion, ha.accion as accion, ha.tiempoejecucion as tiempoejecucion_accion, ha.memoria as memoria_accion")
            ->addSelect("hd.esquema||'-'||hd.tabla as descripcion_dato, hd.idoperacion as idoperacion_dato")
            ->addSelect("hexec.codigo as codigo_excepcion")
            ->addSelect("hinteg.origen as origen_integracion, hinteg.destino as destino_integracion, hinteg.metodo as metodo_integracion, , hinteg.tiempoejecucion as tiempoejecucion_integracion, hinteg.memoria as memoria_integracion")
            ->from('HisTraza t')
            ->leftJoin('t.HisAccion ha')
            ->leftJoin('t.HisDato hd')
            ->leftJoin('t.HisExcepcion hexec')
            ->leftJoin('t.HisIoc hinteg')
            ->innerJoin('t.NomCategoriatraza nct')
            ->innerJoin('t.NomTipotraza nt');
        self::addConditionsTraces($query, $params);
        return $query->fetchArray();
    }

    /**
     * Retorna la cantidad de trazas filtrando por params
     * @method findCountTraces
     * @params {Array} params --- Arreglo de valores por los que se filtrará(ver descripcion metodo addConditionsTraces)
     * @return {Array} Cantidad de trazas que cumple con params.
     */
    public static function findCountTraces($params)
    {
        unset($params['start']);
        unset($params['limit']);
        $query = Doctrine_Query::create(HisTraza::getConn())
            ->from('HisTraza t');
        self::addConditionsTraces($query, $params);
        return $query->count();
    }
    /**
     * Retorna la descripcion de la Accion
     *     *
     * @method getDescription
     *
     * @return string Descripcion de la accion.
     */
    public static function getDescription($controller,$action)
    {
        $ref= '/index.php/'.$controller.'/'.$controller;
        $query = Doctrine_Query::create(HisTraza::getConn());
        $query->select("t.descripcion")
            ->from('DatAccion t')
            ->innerJoin('t.DatFuncionalidad nct')
            ->where("nct.referencia LIKE ?","%{$ref}%")
            ->addWhere("t.denominacion = ?",$action);
         return $query->fetchArray();
    }

    /**
     * Función para agregar las condiciones para la busqueda de las trazas al objeto Doctrine_Query pasado como parametro por referencia
     *
     * @method addConditionsTraces
     * @params {Object} $queryDoctrine --- Objeto Doctrine_Query pasado por referencia
     * @params {Array} $params --- Arreglo de parametros que puede tener los siguientes atributos:
     *  {
            * fechainicio --- String (en cuarquier formato fecha)
            * fechafin --- String (en cuarquier formato fecha)
            * horainicio --- String
            * horafin --- String
            * idseccion --- String
            * referencia --- String
            * usuarios --- Array de string (arreglo de nombres de usuarios)
            * idtipotrazas --- Array de Integer (arreglo de id de tipos de trazas)
     * }
     *
    *@return {Void} Modifica el objeto Doctrine_Query agregandole las condiciones
     */
    public static function addConditionsTraces(&$queryDoctrine, $params){
        if($params['fechainicio']){
            $dt = new DateTime($params['fechainicio']);
            $params['fechainicio'] = $dt->format('Y-m-d');
        }
        if($params['fechafin']){
            $dt = new DateTime($params['fechafin']);
            $params['fechafin'] = $dt->format('Y-m-d');
        }
        if($params['fechainicio'] && $params['fechafin']){
            $queryDoctrine->addWhere("t.fecha BETWEEN ? and ?",array($params['fechainicio'], $params['fechafin']));
        }elseif($params['fechainicio']){
            $queryDoctrine->addWhere("t.fecha >= ?",array($params['fechainicio']));
        }elseif($params['fechafin']){
            $queryDoctrine->addWhere("t.fecha <= ?",array($params['fechafin']));
        }
        if($params['horainicio'] && $params['horafin']){
            $queryDoctrine->addWhere("t.hora BETWEEN ? and ?",array($params['horainicio'], $params['horafin']));
        }elseif($params['horainicio']){
            $queryDoctrine->addWhere("t.hora >= ?",array($params['horainicio']));
        }elseif($params['horafin']){
            $queryDoctrine->addWhere("t.hora <= ?",array($params['horafin']));
        }

        if(isset($params['usuarios']) && $params['usuarios'] != '' && count($params['usuarios']) > 0){
            $usuarios = implode("','", $params['usuarios']);
            $queryDoctrine->addWhere("t.usuario IN ('{$usuarios}')");
        }
        if(isset($params['idtipotrazas']) && $params['idtipotrazas'] != '' && count($params['idtipotrazas']) > 0){
            $idtipostraza = implode(',', $params['idtipotrazas']);
            $queryDoctrine->addWhere("t.idtipotraza IN ({$idtipostraza})");
        }
        if($params['idseccion']){
            $queryDoctrine->addWhere("t.idseccion = ?",array($params['idseccion']));
        }
        if($params['idcategoriatraza'] && $params['idcategoriatraza'] != 0){
            $queryDoctrine->addWhere("t.idcategoriatraza = ?", $params['idcategoriatraza']);
        }
        if($params['ippc']){
            $queryDoctrine->addWhere("t.ippc = ?", $params['ippc']);
        }
        if($params['referencia']){
            $queryDoctrine->addWhere("t.referencia LIKE ?",array("%{$params['referencia']}%"));
        }
        if($params['start'] != ''){
            $queryDoctrine->offset($params['start']);
        }
        if($params['limit'] != ''){
            $queryDoctrine->limit($params['limit']);
        }
    }
    /**
     * Función para agregar las condiciones para la busqueda de las trazas para el arbol
     *  al objeto Doctrine_Query pasado como parametro por referencia
     * @method addConditionsTracesTree
     * @params {Object} $queryDoctrine --- Objeto Doctrine_Query pasado por referencia
     * @params {Array} $params --- Arreglo de parametros que puede tener los siguientes atributos:
     *  {
     *      fechainicio --- String (en cuarquier formato fecha)
     *      fechafin --- String (en cuarquier formato fecha)
     *      horainicio --- String
     *      horafin --- String
     *      idseccion --- String
     *      referencia --- String
     *      usuarios --- Array de string (arreglo de nombres de usuarios)
     *      idtipotrazas --- Array de Integer (arreglo de id de tipos de trazas)
     * }
     *
     * @return {Void} Modifica el objeto Doctrine_Query agregandole las condiciones
     */
    public static function addConditionsTracesTree(Doctrine_Query &$queryDoctrine, $params) {
        $hayFiltroCategoria =  $params['idcategoriatraza'] != '';
        $hayFiltrousuarios = $params['usuario'] &&  count($params['usuario']) > 0;
        $hayFiltrotipotraza = $params['idtipotraza'] &&  count($params['idtipotraza']) > 0;
        $hayFiltroip = $params['ippc'] != '';

        /*--Filtros de las fechas desde - hasta---*/
        if ($params['fechainicio'] && $params['fechafin']) {
            $queryDoctrine->addWhere("t.fecha BETWEEN ? and ?", array($params['fechainicio'], $params['fechafin']));
        } elseif ($params['fechainicio']) {
            $queryDoctrine->addWhere("t.fecha >= ?", array($params['fechainicio']));
        } elseif ($params['fechafin']) {
            $queryDoctrine->addWhere("t.fecha <= ?", array($params['fechafin']));
        }
        /*-----Tipo : inicio --- Se cargar los usuarios---*/
        if ($params['tipo'] == 'inicio') {
            /*
            * Si hay filtro de usuarios se agrega la condicion de usuario de esta manera
            * ya que este filtro se utiliza unicamente cuando se cargan los usuarios
            * (se filtra por los usuarios seleccionados en el combo)
            */
            if($hayFiltroip){$queryDoctrine->addWhere("t.ippc = ?", $params['ippc']);}

            if($hayFiltroCategoria){$queryDoctrine->addWhere("t.subsistema = ?", $params['idcategoriatraza']);}

            if($hayFiltrousuarios){
                $usuarios = implode("','", $params['usuario']);
                $queryDoctrine->addWhere("t.usuario IN ('{$usuarios}')");
            }
        }
        /*-----Tipo : usuario --- Se cargar las sesiones---*/
        if ($params['tipo'] == 'usuario') {
            $queryDoctrine->addWhere("t.usuario = ?", $params['value']);
            if($hayFiltroip){$queryDoctrine->addWhere("t.ippc = ?", $params['ippc']);}

            /*else if($params['value'] != 'anonimo'){
                $queryDoctrine->addWhere("t.idtipotraza = ?", 8);
            }else{
                $queryDoctrine->addWhere("t.idtipotraza  = ?",10);
            }*/
            
        }

        /*-----Tipo : sesion --- Se cargar las trazas--*/
            if ($params['tipo'] == 'sesion') {
            $queryDoctrine->addWhere("t.idseccion = ?", $params['value']);
//            $queryDoctrine->addWhere("t.idtrazapadre IS NOT NULL");
            if ($params['usuario_sesion']){
                $queryDoctrine->addWhere("t.usuario = ?", $params['usuario_sesion']);
            }
        }

        /*-----Tipo : trace --- Se cargar las trazas hijas */
        if ($params['tipo'] == 'trace'){
            $queryDoctrine->addWhere("t.idtrazapadre = ?", $params['value']);
            if ($params['usuario_sesion']){
                $queryDoctrine->addWhere("t.usuario = ?", $params['usuario_sesion']);
            }
        }
        /*
         * Si hay filtro de categoria y no es tipo usuario entonces se agrega la condicion de idcategoria
         */
        if($hayFiltroCategoria && $params['tipo'] != 'usuario'){
                $queryDoctrine->addWhere("t.subsistema = ?", $params['idcategoriatraza']);
        }
        if($hayFiltrotipotraza && $params['tipo'] != 'usuario'){
            $tipotraza = implode("','", $params['idtipotraza']);
            $queryDoctrine->addWhere("t.idtipotraza IN ('{$tipotraza}')");
        }

    }
}
