<?php

/**
 * Clase de acceso a datos de trazas.
 *
 * @author     Equipo de seguridad UCID.
 * @package    ZendExt.
 * @subpackage ZendExt_Trace.
 * @version    4.0
 */
class HisTraza extends BaseHisTraza {

    function setUp() {
        $this->hasOne('NomCategoriatraza', array('local' => 'idcategoriatraza', 'foreign' => 'idcategoriatraza'));
        $this->hasOne('NomTipotraza', array('local' => 'idtipotraza', 'foreign' => 'idtipotraza'));
        $this->hasOne('HisAccion', array('local' => 'idtraza', 'foreign' => 'idtraza'));
        $this->hasOne('HisDato', array('local' => 'idtraza', 'foreign' => 'idtraza'));
        $this->hasOne('HisBloqueo', array('local' => 'idtraza', 'foreign' => 'idtraza'));
        $this->hasOne('HisExcepcion', array('local' => 'idtraza', 'foreign' => 'idtraza'));
        $this->hasOne('HisFalloAutenticacion', array('local' => 'idtraza', 'foreign' => 'idtraza'));
        $this->hasOne('HisIoc', array('local' => 'idtraza', 'foreign' => 'idtraza'));
        $this->hasOne('HisTraza', array('local' => 'idtrazapadre', 'foreign' => 'idtraza'));
    }

    public static function  getConn(){
        $transactionManager = ZendExt_Aspect_TransactionManager::getInstance();
        $configApp = new ZendExt_App_Config();
        $configApp->addBdToConfig('traza', 'traza');
        $conn = $transactionManager->openConections('traza');
        return $conn;
    }

//------------------------------------------------------------------------
   /**
    * Se usa para exportar traza en xml
   */
    public static function cargardatostraza($id) {
        $query = Doctrine_Query::create(self::getConn());
        $query->select('t.idtraza,t.fecha,t.hora,t.idtrazapadre,t.idtipotraza,t.usuario,t.referencia,t.idseccion,t.idcategoriatraza,t.ippc,t.subsistema')
            ->from('HisTraza t')
            ->where('t.idtraza=?', $id);
        return $query->fetchArray();
    }


    public static function cargarusuario($params) {//esto es nuevo
        $query = Doctrine_Query::create(self::getConn());
        $query->select('DISTINCT (t.usuario) as usuario, t.usuario as value')
                ->from('HisTraza t');
        self::addConditionsTracesTree($query, $params);
        return $query->fetchArray();
    }

    /**
     * Retorna las trazas de la seccion que cumplen con los parametros del fltro
     */
    public static function getIfChildParams($params,$idsesion) {

        $query = Doctrine_Query::create(self::getConn());
        $query->select('t.idseccion as session')
            ->from('HisTraza t');
        self::addConditionsTracesTree($query, $params,$idsesion);
        return $query->fetchArray();
    }
    public static function getDatosTraza($params) {
        $query = Doctrine_Query::create(self::getConn());
        switch ($params['tipo']) {
            case 'Acción': {
                    $query->select('t.controlador, t.accion,h.referencia referencia,t.tiempoejecucion')
                            ->from('HisAccion t')
                            ->innerJoin('t.HisTraza h')
                            ->where('t.idtraza= ?', $params['id']);
                    return $query->fetchArray();
                }
                break;
            case 'Excepción': {
                    $query->select('t.codigo, t.tipo,t.idioma,t.mensaje,t.descripcion,t.log')
                            ->from('HisExcepcion t')
                            ->where('t.idtraza= ?', $params['id']);
                    return $query->fetchArray();
                }
                break;
            case 'Dato': {
                    $query->select('t.esquema,idobjeto,t.tabla, nct.denominacion tipooperacion,t.dato as dato')
                            ->from('HisDato t')
                            ->innerJoin('t.NomOperacion nct')
                            ->where('t.idtraza= ?', $params['id']);
                    $resp = $query->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
                             foreach($resp as $k=>$val){
                                 $resp[$k]['dato']=unserialize($val['dato']);
                             }
                             return $resp;
                }
                break;
            case 'Integración': {
                    $query->select('t.origen, t.destino,t.clase,t.metodo,t.tiempoejecucion,t.memoria,t.interno')
                            ->from('HisIoc t')
                            ->where('t.idtraza= ?', $params['id']);
                    return $query->fetchArray();
                }
            case 'Autenticación': {
                    $query->select('t.ippc')
                            ->from('HisTraza t')
                            ->where('t.idtraza= ?', $params['id']);
                    return $query->fetchArray();
                }
            case 'Cierre sesión': {
                    $query->select('t.ippc')
                            ->from('HisTraza t')
                            ->where('t.idtraza= ?', $params['id']);
                    return $query->fetchArray();
                }
            case 'Bloqueo': {
                    $query->select('tb.tipobloqueo tipobloqueo')
                            ->from('HisBloqueo t')
                            ->innerJoin('t.NomTipobloqueo tb')
                            ->where('t.idtraza= ?', $params['id']);
                    return $query->fetchArray();
                }
                break;
            default :
                break;
        }
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
     * @return Void. Modifica el objeto Doctrine_Query agregandole las condiciones
     */
    public static function addConditionsTracesTree(&$queryDoctrine, $params, $idsesion = '') {

        if ($params['fechainicio'] && $params['fechafin']) {
            $queryDoctrine->addWhere("t.fecha BETWEEN ? and ?", array($params['fechainicio'], $params['fechafin']));
        } elseif ($params['fechainicio']) {
            $queryDoctrine->addWhere("t.fecha >= ?", array($params['fechainicio']));
        } elseif ($params['fechafin']) {
            $queryDoctrine->addWhere("t.fecha <= ?", array($params['fechafin']));
        }
       /*if ($params['tipo'] != 'usuario' && $params['idcategoriatraza'] != '' && $params['idcategoriatraza'] != null) {
            $queryDoctrine->addWhere("t.idcategoriatraza = ?", $params['idcategoriatraza']);
        }*/
        if ($params['tipo'] == 'inicio') {
            if(isset($params['usuario']) && $params['usuario'] != '' && count($params['usuario']) > 0){
                $usuarios = implode("','", $params['usuario']);
                $queryDoctrine->addWhere("t.usuario IN ('{$usuarios}')");
            }
            if($params['idcategoriatraza'] != '' && $params['idcategoriatraza'] != null && $params['idcategoriatraza'] != 0){
                $queryDoctrine->addWhere("t.idcategoriatraza = ?", $params['idcategoriatraza']);
            }
        }
        if ($params['tipo'] == 'usuario' && $params['value'] != 'anonimo') {
      
            $queryDoctrine->addWhere("t.usuario = ?", $params['value']);
            if($idsesion==''){
                $queryDoctrine->addWhere("t.idtipotraza = ?", 8);
            }else{
                if($params['idcategoriatraza'] != '' && $params['idcategoriatraza'] != null && $params['idcategoriatraza'] != 0){
                    $queryDoctrine->addWhere("t.idcategoriatraza = ?", $params['idcategoriatraza']);
                 }
                $queryDoctrine->addWhere("t.idseccion = ?",$idsesion);
            }
        }
        if ($params['tipo'] == 'sesion') {

            $queryDoctrine->addWhere("t.idseccion = ?", $params['value']);
            $queryDoctrine->addWhere("t.idtipotraza IN (1,3,7,10)");
            $queryDoctrine->addWhere("t.idtrazapadre IS NULL");
            if($params['idcategoriatraza'] != '' && $params['idcategoriatraza'] != null && $params['idcategoriatraza'] != 0){
                $queryDoctrine->addWhere("t.idcategoriatraza = ?", $params['idcategoriatraza']);
            }
        }
        if ($params['tipo'] == 'trace' || ($params['tipo'] == 'usuario' && $params['value'] == 'anonimo')) {
            if ($params['tipo'] != 'usuario') {
                $queryDoctrine->addWhere("t.idtrazapadre = ?", $params['value']);
               /* if($params['idcategoriatraza'] != '' && $params['idcategoriatraza'] != null){
                    $queryDoctrine->addWhere("t.idcategoriatraza = ?", $params['idcategoriatraza']);
                }*/
            } else {
                $queryDoctrine->addWhere("t.usuario = ?", $params['value']);
            }
        }

        if ($params['start'] != '') {
            $queryDoctrine->offset($params['start']);
        }
        if ($params['limit'] != '') {
            $queryDoctrine->limit($params['limit']);
        }
    }

    /**
     * Retorna las trazas por Usuario y seccion
     */
    public static function getTrazaByUserandSesion($params) { // y ademas
        $query = Doctrine_Query::create(self::getConn());
        $query->select('t.idtraza,t.idtraza as value,t.ippc,t.idseccion,t.referencia,t.fecha,t.hora,ha.accion,ha.descripcion,ha.memoria,ha.tiempoejecucion,nct.denominacion, nt.tipotraza')
                ->from('HisTraza t')
                ->innerJoin('t.NomCategoriatraza nct')
                ->innerJoin('t.NomTipotraza nt')
                ->leftJoin('t.HisAccion ha');
        self::addConditionsTracesTree($query, $params);
        return $query->fetchArray();
    }

    public static function getTrazaCategory($idcategoria) {//esto es nuevo
        $query = Doctrine_Query::create(self::getConn());
        $traza = $query->select('p.denominacion as denominacion')
                ->from('NomCategoriatraza p')
                ->where('p.idcategoriatraza=?', $idcategoria)
                ->fetchArray();
        return $traza[0][denominacion];
    }

    public static function getHijosSecions($idpadre, $tipo) {//esto es nuevo
        $query = Doctrine_Query::create(self::getConn());
        $traza = $query->select('COUNT(*) as hijossecions')
                ->from('HisTraza t')
                ->where('t.idtrazapadre= ?', $idpadre)
                ->andwhere('t.idtipotraza IN (1,3,7,10,6)')
                ->fetchArray();
        return $traza;
    }

    public static function getHijosTraza($idpadre) {//esto es nuevo
        $query = Doctrine_Query::create(self::getConn());
        $traza = $query->select('COUNT(*) as hijostrazas')
                ->from('HisTraza t')
                ->where('t.idtrazapadre= ?', $idpadre)
                ->fetchArray();
        return $traza;
    }

    public static function getTipo($idtipo) {//esto es nuevo
        $query = Doctrine_Query::create(self::getConn());
        $traza = $query->select('t.tipotraza as tipo')
                ->from('NomTipotraza t')
                ->where('t.idtipotraza = ?', $idtipo)
                ->fetchArray();
        return $traza;
    }

    //------------------------------------------------------
    /**
     * Retorna los Usuarios
     */
    public static function cargarusuarioOld($params) {//esto es nuevo
        $query = Doctrine_Query::create(self::getConn());
        $users = $query->select('DISTINCT t.usuario as usuario')
                ->from('HisTraza t')
                ->whereIn('t.usuario', $params['users'])
                ->andwhere('t.fecha >= ?', $params['f.inicio'])
                ->andwhere('t.fecha <= ?', $params['f.fin'])
                ->fetchArray();

        return $users;
    }

    /**
     * Retorna las fechas por Usuarios
     */
    public static function getDateByUsser($user, $params) {//esto tambien
        $query = Doctrine_Query::create(self::getConn());
        $users = $query->select('DISTINCT t.fecha as fecha')
                ->from('HisTraza t')
                ->where('t.usuario >= ?', $user)
                ->andwhere('t.fecha >= ?', $params['f.inicio'])
                ->andwhere('t.fecha <= ?', $params['f.fin'])
                ->fetchArray();
        return $users;
    }

    /**
     * Retorna las sessiones por Fecha
     */
    public static function getSessionsByDate($date) { // y ademas
        $query = Doctrine_Query::create(self::getConn());
        $ses = $query->select('DISTINCT t.idseccion as session')
                ->from('HisTraza t')
                ->where('t.fecha >= ?', $date)
                ->fetchArray();
        return $ses;
    }

    /**
     * Retorna un listado de trazas que contiene la cantidad de trazas por categorías.
     * Dinámicamente se le añaden filtros que enrriquecen el reporte.
     *
     * @method getGraficByCategory
     * @param array $array Arreglo de parámetros que se usan para realizar los filtros.
     *
     * @return array Listado de cantidad de trazas por categoría.
     */
    public static function getGraficByCategory($array) {
        $sql = "SELECT DISTINCT m.subsistema, COUNT(m.idtraza)
                FROM mod_traza.his_traza m
                WHERE ({$array['filtros']})
                GROUP BY m.subsistema";
        return self::getConn()->fetchAll($sql, $array['datos']);

        /*$sql = "SELECT DISTINCT n.denominacion, COUNT(m.idtraza)
                FROM mod_traza.his_traza m
                INNER JOIN nom_categoriatraza n ON (m.idcategoriatraza = n.idcategoriatraza)
                {$array['join']}
                WHERE ({$array['filtros']})
                GROUP BY n.denominacion";
        return Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql, $array['datos']);*/
    }

    /**
     * Retorna un listado de trazas que contiene la cantidad de trazas por fecha.
     * Dinámicamente se le añaden filtros que enrriquecen el reporte.
     *
     * @method getGraficByDate
     * @param array $array Arreglo de parámetros que se usan para realizar los filtros.
     *
     * @return array Listado de cantidad de trazas por fecha.
     */
    public static function getGraficByDate($array) {
        $sql = "SELECT DISTINCT m.fecha, COUNT(m.idtraza)
                FROM mod_traza.his_traza m                             
                WHERE ({$array['filtros']})
                GROUP BY m.fecha";
        return self::getConn()->fetchAll($sql, $array['datos']);
    }

    /**
     * Retorna un listado de trazas que contiene la cantidad de trazas por usuario.
     * Dinámicamente se le añaden filtros que enrriquecen el reporte.
     *
     * @method getGraficByDate
     * @param array $array Arreglo de parámetros que se usan para realizar los filtros.
     *
     * @return array Listado de cantidad de trazas por usuario.
     */
    public static function getGraficByUser($array) {
        return self::getConn()->fetchAll(
                        "SELECT DISTINCT m.usuario, COUNT(m.idtraza)
                FROM mod_traza.his_traza m                       
                WHERE ({$array['filtros']})
                GROUP BY m.usuario", $array['datos']
        );
    }

    /**
     * Retorna un listado de trazas que contiene la cantidad de trazas por tipos.
     * Dinámicamente se le añaden filtros que enrriquecen el reporte.
     *
     * @method getGraficByTipe
     * @param array $array Arreglo de parámetros que se usan para realizar los filtros.
     *
     * @return array Listado de cantidad de trazas por tipos.
     */
    public static function getGraficByTipe($array) {
       return self::getConn()->fetchAll(
                        "SELECT DISTINCT t.tipotraza, COUNT(m.idtraza)
            FROM mod_traza.his_traza m
            INNER JOIN mod_traza.nom_tipotraza t ON (m.idtipotraza = t.idtipotraza)
            INNER JOIN nom_categoriatraza n ON (m.idcategoriatraza = n.idcategoriatraza) 
            WHERE ({$array['filtros']})
            GROUP BY t.tipotraza",$array['datos']
        );

    }

}
