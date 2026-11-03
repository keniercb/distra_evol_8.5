<?php

/**
 * @version 1.0
 */
class ConfiguracionActividadesModel extends ZendExt_Model
{

    private $_serviciosConfiguracion;

    public function __construct()
    {
        parent::__construct();
        $this->_serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function adicionarActividad($param)
    {
        $objServicio = new ConfActividad();
        if ($param['servicio']) {
            $servicio = $param['servicio']; 
     
            if ($servicio['idactividad']) {
                $objServicio->assignIdentifier($servicio['idactividad']);           
            } /*else {
                $entidad = new DatActividadEntidadTall();
                $entidad->identidad = $this->global->Estructura->idestructura;
            }*/
            $servicio['medida'] = ($servicio['medida']) ? $servicio['medida'] : $objServicio->medida;
            $objServicio->synchronizeWithArray($servicio);
            $objServicio->save();
           $this->modificarActividades($servicio);

        } else if ($param['actividades']) {
            $actividades = Zend_Json::decode($param['actividades']);
            if ($actividades[0]['tiempoplanificado'] == null) {
                throw new LogisticaException('LOG_T_002');
            }
            if ($actividades[0]['_is_leaf'] == 1) {
                foreach ($actividades as $actModf) {
                    $tiempoplanifNew = $actModf['tiempoplanificado']; 
                    $query = Zend_Registry::get('conexion');
                    $query->execute("UPDATE mod_logtaller.conf_actividad
            SET tiempoplanificado = {$tiempoplanifNew}
            WHERE idactividad={$actModf['idactividad']}")->fetchAll(PDO::FETCH_ASSOC);
                    $conn = Zend_Registry::get('conexion');
                    $selec = "select ca.* from mod_logtaller.conf_actividad ca where ca.idactividad = {$actModf['idactividad']}";
                    $datos = $conn->execute($selec)->fetchAll(PDO::FETCH_ASSOC);
                    return $datos;
                }
            }
            if ($actividades[0]['modificar'] == 1) {
//                $objServicio->assignIdentifier($actividades[0]['idactividad']);
                $queryUpdate = Doctrine_Query::create();
                //$newtiempoplanificado = $actividades[0]['tiempoplanificado'];
                $porcentual = $actividades[0]['porcentual'] ? $actividades[0]['porcentual'] : 0;

                if ($actividades[0]['um'] && is_numeric($actividades[0]['medida'])) {
                    $medida = $actividades[0]['medida'];
                    $queryUpdate->set('ca.medida', "'$medida'");
                } else if (!$actividades[0]['um']) {
//                    $medida = $objServicio->medida;
                    $queryUpdate->set('ca.medida', "null");
                }
                
                $um = $actividades[0]['um'] ? $actividades[0]['um'] : 0;                    
                $porcentual = $actividades[0]['porcentual'] ? $actividades[0]['porcentual'] : 0;
                if ($actividades[0]['minimo']) {
                    $minimo =  $actividades[0]['minimo']; 
                    $queryUpdate->set('ca.minimo', "'$minimo'");
                 }
                if ($actividades[0]['maximo']) {
                    $maximo =  $actividades[0]['maximo'];   
                    $queryUpdate->set('ca.maximo', "'$maximo'");
                }
                if (is_numeric($actividades[0]['tempario'])) {
                    $queryUpdate->set('ca.tempario', $actividades[0]['tempario']);
                }
//                if ($actividades[0]['porcentual']){
//                    $queryUpdate->set('ca.porcentual', "'$porcentual'");
//                }
                $idactividad = $actividades[0]['idactividad']; 
                $queryUpdate->update('ConfActividad ca')
                 //->set('ca.tiempoplanificado', "'$newtiempoplanificado'")
                 ->set('ca.modificado', 1)
                 ->set('ca.um', "'$um'")
                 ->set('ca.porcentual', "'$porcentual'")
                 ->Where('ca.idactividad = ?', array($idactividad))->execute();
            } else {
                $colletAct = new Doctrine_Collection('ConfActividad');
                foreach ($actividades as $act) {
                    $objAct = new ConfActividad();

                    $objAct->synchronizeWithArray($act);
                    $objAct['porcentual'] = null;
                    $objAct['maximo'] = null;
                    $objAct['minimo'] = null;
                    $objAct['medida'] = null;
                    $colletAct[] = $objAct;
                }
                if (count($colletAct)) {
                    $colletAct->save();
                }
            }
        }
     
    }
    //

    public function modificarActividades($servicio)
    {   
        if ($servicio['idactividad']) {
            $minimo = $servicio['minimo'] ? $servicio['minimo'] : 0;
            $maximo = $servicio['maximo'] ? $servicio['maximo'] : 0;
            $medida = $servicio['medida'] ? $servicio['medida'] : 0;
            $porcentual = $servicio['porcentual'] ? $servicio['porcentual'] : 'null';   
            // $porcentual = $servicio['porcentual'] == 1 ? 1 : 0;  
            $um = $servicio['um'] ? $servicio['um'] : 0;       
            $query = Zend_Registry::get('conexion');
        
            $query->execute("UPDATE mod_logtaller.conf_actividad
            SET minimo = $minimo,
            maximo = $maximo,
            medida = '$medida',
            porcentual = $porcentual,
            um = $um
            WHERE idpadre ={$servicio['idactividad']} and modificado is null")->fetchAll(PDO::FETCH_ASSOC);
            // WHERE idpadre ={$servicio['idactividad']} and modificado = 0")->fetchAll(PDO::FETCH_ASSOC);
        }

    }
    
    public function duplicarActividad($param)
    {

            if ($param['servicio']) {
                $conn = Zend_Registry::get('conexion');
                $objServicio = new ConfActividad();
                $servicio = $param['servicio'];
                $idactividad = $servicio['idactividad'];
                unset($servicio['idactividad']);
                $objServicio->synchronizeWithArray($servicio);
                $selec = "select ca.* from mod_logtaller.conf_actividad ca where ca.idpadre = {$idactividad} and ca.idpadre <> ca.idactividad";
                $datos = $conn->execute($selec)->fetchAll(PDO::FETCH_ASSOC);

                foreach ($datos as $d) {
                    $act = new ConfActividad();
                    unset($d['idpadre']);
                    unset($d['idactividad']);
                    unset($d['idarbol']);
                    $act->synchronizeWithArray($d);
                    $objServicio->ConfActividad->add($act);
                }
                $objServicio->save();
                /*if($servicio['idactividad']) {
                    $objServicio->assignIdentifier($servicio['idactividad']);
                }
                else {
                    $entidad = new DatActividadEntidadTall();
                    $entidad->identidad = $this->global->Estructura->idestructura;
                    //$objServicio->DatActividadEntidadTall->add($entidad);
                }*/
                //$objServicio->synchronizeWithArray($servicio);


            }

    }

    public function cargarActividades($param)
    {

        $conn = Zend_Registry::get('conexion');
        if ($param['idactividadesServicios']) {
            $selec = "Select ca.denominacion as denominacion, ca.codigo as codigo, ca.tiempoplanificado as tiempoplanificado, ca.idactividad as id, dae.identidad, 
            ca.usatodasnormas, um.abreviaturaunidadmedida as umedida, ca.minimo as minimo, ca.maximo as maximo, ca.porcentual as porcentual, ca.medida as medida, ca.um as um, um1.abreviaturaunidadmedida as abreviaturaunidadmedida
            ,ca.tempario";
            $from = " FROM  mod_logtaller.conf_actividad ca  
            left join mod_logtaller.dat_actividadentidad dae on ca.idactividad = dae.idactividad and dae.identidad = {$this->global->Estructura->idestructura}" .
                " left join mod_datosmaestros.nom_indicador ni on ni.idindicador = ca.idindicador " .
                " left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = ni.idumedida " .
                " left join mod_datosmaestros.nom_unidadmedida um1 on um1.idunidadmedida = ca.medida";
            $where = " where ca.idpadre={$param['idactividadesServicios']}";
        } else {
            $selec = "Select ca.denominacion as denominacion, ca.codigo as codigo, (ca.idindicador is not null) as _is_leaf, (ca.idindicador is not null) as leaf,
         ca.idpadre as _parent, ca.idactividad as id, dae.identidad, ca.minimo as minimo, ca.maximo as maximo, ca.usatodasnormas, ca.um as um, ca.porcentual as porcentual, ca.medida as medida ,um.abreviaturaunidadmedida as umedida, um1.abreviaturaunidadmedida as abreviaturaunidadmedida";
        $from = " FROM  mod_logtaller.conf_actividad ca  
            left join mod_logtaller.dat_actividadentidad dae on ca.idactividad = dae.idactividad and dae.identidad = {$this->global->Estructura->idestructura}" .
            " left join mod_datosmaestros.nom_indicador ni on ni.idindicador = ca.idindicador " .
            " left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = ni.idumedida " .
            " left join mod_datosmaestros.nom_unidadmedida um1 on um1.idunidadmedida = ca.medida";
            
        $where = " where  1=1";
        if ($param['anode']) {
             $param['idpadre'] = $param['anode'];
        }
        if ($param['enlaentidad']) {
            $where .= " AND dae.identidad = {$this->global->Estructura->idestructura} ";
        }
        if ($param['idpadre']) {
            $where .= "  AND ca.idpadre = {$param['idpadre']} ";
        } else { //las actividades del primer nivel no tienen indicador
            $where .= "  AND ca.idindicador is null ";
        }
        if ($param['denominacion']) {
            $where .= "AND ca.denominacion LIKE '%{$param['denominacion']}%'";

            }
        }
        if ($param['criterio']) {
            $where .= "AND (lower(ca.codigo) LIKE lower('%{$param['criterio']}%') 
                 OR lower(ca.denominacion) LIKE lower('%{$param['criterio']}%') )";
        }
        $limit = "";
        if ($param['limit']) {
            $limit .= " LIMIT {$param['limit']} ";
        }
        if ($param['start']) {
            $limit .= "OFFSET {$param['start']} ";
        }

       $orderby .= "ORDER BY ca.codigo ASC";

       // print_r($selec . $from . $where);die;
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec . $from . $where . $orderby)
            ->fetchAll(PDO::FETCH_ASSOC);
        $datos = $conn->execute($selec . $from . $where . $orderby . $limit )->fetchAll();


        return array('datos' => $datos, 'cantidad' => count($total));
    }

    public function cargarActividadesPorServicios($param)
    {
        $conn = Zend_Registry::get('conexion');

        $selec = "Select ca.*,ca.tiempoplanificado as tiempoplanificado, 
         ca.idpadre, ca.idactividad as id, dae.identidad, ca.usatodasnormas, um.abreviaturaunidadmedida as umedida ";
        $from = " FROM  mod_logtaller.conf_actividad ca  
            left join mod_logtaller.dat_actividadentidad dae on ca.idactividad = dae.idactividad and dae.identidad = {$this->global->Estructura->idestructura}" .
            " left join mod_datosmaestros.nom_indicador ni on ni.idindicador = ca.idindicador " .
            " left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = ca.medida";
        $where = " where ca.idpadre = {$param['idpadre']} and ca.idarbol={$param['idpadre']}";

        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec . $from . $where)
            ->fetchAll(PDO::FETCH_ASSOC);
        $datos = $conn->execute($selec . $from . $where)->fetchAll();

        return array('datos' => $datos, 'cantidad' => count($total));
    }

    public function cargarServiciosDelMaestro($param)
    {
        $notiene = 1;
        $param['tipo'] = 2;
        $mproducto = new MaestroProductoModel();
        $query = $mproducto->getQueryIndicador('ind', false);
        $this->_serviciosConfiguracion->getQueryJoinUnidadMedida(
            $query, 'ind', 'umedida', 'umedida.abreviaturaunidadmedida as umedida', 'leftJoin'
        );
        $mproducto->addFiltersQueryIndicador($query, 'ind', $param);
        $mproducto->addQueryJoinIndicadorHoja($query, 'ind', 'indh', 1);
        $mproducto->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true, 'ind');
        $query->addSelect($mproducto->getSelectStringForQueryIndHoja('indh'));
        if ($param['criterio']) {
            $query->addWhere(
                "lower(ind.codigo) LIKE lower('%{$param['criterio']}%') "
                . " OR lower(ind.denominacion) LIKE lower('%{$param['criterio']}%') "
                . " OR lower(ind.numeropieza) LIKE lower('%{$param['criterio']}%')"
                . " OR lower(umedida.abreviaturaunidadmedida) LIKE lower('%{$param['criterio']}%')"
                ." OR lower(ind.numeropieza) LIKE lower('%{$param['criterio']}%')"
            );
        }
        if ($param['idactividad']) {
            $actvExcluir = $this->cargarActividades(array('idpadre' => $param['idactividad']))['datos'];
            $excluir = array();
            foreach ($actvExcluir as $ids) {
                $excluir[] = $ids['idindicador'];
            }

            if (count($excluir) > 0) {
                $query->andWhereNotIn('ind.idindicador', $excluir);
            }
        }

        /* if ($param['idactividadesServicios']) {
             $actvporServicios = $this->cargarActividadesPorServicios(array('idpadre' => $param['idactividadesServicios']))['datos'];

             $incluir = array();
             foreach ($actvporServicios as $ids) {
                 $incluir[] = $ids['idindicador'];
             }
             if (!empty($incluir)) {
                 $query->andWhereIn('ind.idindicador', $incluir);
             } else {
                 $notiene = 0;
             }


         }*/

        $mproducto->addFiltersQueryIndicadorHoja($query, $param);
        if($param['start']){
            $query->offset($param['start']);
        }
        if($param['limit']){
            $query->limit($param['limit']);
        }

        if ($notiene == 0) {
            $result = 0;
        } else {

            $result = $query->fetchArray();
        }

        return array('datos' => $result, 'cantidad' => $query->count());
    }


    public function eliminarActividad($ids)
    {

        $ids['ids'] = Zend_Json::decode($ids['ids']);

        Doctrine_Query::create()
            ->delete('ConfActividad ca')->WhereIn('ca.idpadre', $ids['ids'])->andwhereIn('ca.idarbol', $ids['ids'])->execute();

        return Doctrine_Query::create()
            ->delete('ConfActividad ca')->WhereIn('ca.idactividad', $ids['ids'])->execute();


    }

    public function usaEnLaEntidad($params)
    {
        $ides = Zend_Json::decode($params['ids']);
        if (count($ides)) {
            if ($params['usar']) {
                $colletAct = new Doctrine_Collection('ConfActividad');
                foreach ($ides as $idactividad) {
                    $entidad = new DatActividadEntidadTall();
                    $entidad->identidad = $this->global->Estructura->idestructura;
                    $entidad->idactividad = $idactividad;
                    $colletAct[] = $entidad;
                    if ($params['hijo']) {
                        $this->UsarEntidadActporServ($idactividad);
                    }
                }
                if (count($colletAct)) {
                    return $colletAct->save();
                }
                return false;
            } else {
                if ($params['hijo']) {
                    $conn = Zend_Registry::get('conexion');
                    $selec = "select ca.idactividad from mod_logtaller.conf_actividad ca where ca.idpadre in (".implode(',',$ides).")";
                    $ActporServ = $conn->execute($selec)->fetchAll(PDO::FETCH_COLUMN);
                    $ides = array_merge($ides, $ActporServ);
                    return Doctrine_Query::create()
                        ->delete('DatActividadEntidadTall')->addWhere(
                            'identidad = ?', array($this->global->Estructura->idestructura)
                        )->andWhereIn('idactividad', $ides)
                        ->execute();
                } else {
                    return Doctrine_Query::create()
                        ->delete('DatActividadEntidadTall')->addWhere(
                            'identidad = ?', array($this->global->Estructura->idestructura)
                        )->andWhereIn('idactividad', $ides)
                        ->execute();

                }

            }
        }
    }

    public function UsarEntidadActporServ($idactividadporServ)
    {

        $conn = Zend_Registry::get('conexion');
        $selec = "select ca.idactividad from mod_logtaller.conf_actividad ca where ca.idpadre = {$idactividadporServ}";
        $ActporServ = $conn->execute($selec)->fetchAll(PDO::FETCH_ASSOC);

        $colletActServ = new Doctrine_Collection('ConfActividad');
        foreach ($ActporServ as $a) {


            $entidads = new DatActividadEntidadTall();
            $entidads->identidad = $this->global->Estructura->idestructura;
            $entidads->idactividad = $a['idactividad'];
            $colletActServ[] = $entidads;
        }

        if (count($colletActServ)) {
            return $colletActServ->save();
        }
        return false;

    }

    public function cargarNormas($params)
    {
        $asExt = "cn";
        $query = Doctrine_Query::create();
        $query->select("$asExt.idnorma, $asExt.idindicador, $asExt.idactividad, $asExt.cantidad as norma")
            ->from("ConfNorma $asExt")
            ->innerJoin("$asExt.ConfActividad cact")
            ->where('idactividad = ?', array($params['idActividad']));

        $cantidad = $query->count();
        $maestroProducto = new MaestroProductoModel();
        $maestroProducto->addQueryNomIndicador($query, $asExt, 'i', 'ih', $select = true, false, 1, true);
        $datos = $query->fetchArray();
        return array(
            'datos' => $datos,
            'cantidad' => $cantidad
        );
    }

    public function adicionarNormas($idactividad, $idIndicadores = array())
    {

        $collection = new Doctrine_Collection('ConfNorma');
        foreach ($idIndicadores as $idIndicador) {

            $entity = new ConfNorma();
            $entity->idindicador = $idIndicador;
            $entity->idactividad = $idactividad;
            $collection->add($entity);

        }
        return $collection->save();
    }

    public function guardarNormas($normas)
    {

        $collection = new Doctrine_Collection('ConfNorma');
        foreach ($normas as $norma) {
            $entity = new ConfNorma();
            $entity->assignIdentifier($norma->idnorma);
            $entity->cantidad = $norma->norma;
            $collection->add($entity);
        }
        return $collection->save();
    }

    public function eliminarNormas($listaidnormas)
    {
        foreach ($listaidnormas as $le){
            return Doctrine_Query::create()
                ->delete('ConfNorma cn')->WhereIn('cn.idnorma', $le)->execute();


        }

    }
}
