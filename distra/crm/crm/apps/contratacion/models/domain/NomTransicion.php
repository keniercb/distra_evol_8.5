<?php

class NomTransicion extends BaseNomTransicion
{
    private $_result;
    private $_alias;

    public function setUp()
    {
        $this->hasOne(
            'NomEstado',
            array('local' => 'idestadoinicial', 'foreign' => 'idestado')
        );
        $this->hasOne(
            'NomEstado',
            array('local' => 'idestadofinal', 'foreign' => 'idestado')
        );
        $this->hasMany(
            'DatRolTransicion',
            array('local' => 'idtransicion', 'foreign' => 'idtransicion')
        );
        $this->hasOne(
            'NomProceso',
            array('local' => 'idproceso', 'foreign' => 'idproceso')
        );
        parent::setUp();
    }

    public function preInsertValues($params)
    {
        $idestructura = ZendExt_GlobalConcept::getInstance(
        )->Estructura->idestructura;
        $params['idestructura'] = $idestructura;
        return $params;
    }

    public function postInsertValues($out)
    {
        $roles = json_decode($out['params']['roles']);
        $idtransicion = $out['model']->idtransicion;

        foreach ($roles as $rol) {
            $model = new DatRolTransicion();
            $model->idtransicion = $idtransicion;
            $model->idrol = $rol->idrol;
            $model->obligatorio = $rol->obligatorio=='true'?1:0;
            $model->save();
        }

        $notificaciones = json_decode($out['params']['notificaciones']);
    }

    public function postModifyValues($out)
    {
        $roles = json_decode($out['params']['roles']);
        $idtransicion = $out['model']->idtransicion;

        $query = new Doctrine_Query();
        $query->delete()->from('DatRolTransicion drt')->where(
            'drt.idtransicion=?', $idtransicion
        )->execute();

        if (!empty($roles)) {
//            print_r($roles);die;
            foreach ($roles as $rol) {
                $model = new DatRolTransicion();
                $model->idtransicion = $idtransicion;
                $model->idrol = $rol->idrol;
                $model->obligatorio = $rol->obligatorio?$rol->obligatorio:0;
//                $model->idrol = $rol;
                $model->save();
            }
        }
    }

    private function createQuery($params)
    {
        $agStart = $params[0];
        $agLimit = $params[1];
        $agOrder = $params[2];
        $agOrderDirect = $params[3];

        $modelName = get_class($this);
        $columsId = $this->getTable()->getIdentifierColumnNames();
        $strIdentifiesColumns = implode(', a.', $columsId);
        $columns = $this->getTable()->getColumnNames();
        $strIColumns = implode(', a.', $columns);

        // Verificar el orden de los datos
        if (!$agOrder) {
            $agOrder = $strIdentifiesColumns;
        }

        // Busar los elementos definidos dentro del inicio y limite ordenados
        $q = new Doctrine_Query();
        $this->_result = $q->select('a.' . $strIColumns)->from(
            $modelName . ' a '
        )
            ->orderby($agOrder . ' ' . $agOrderDirect)->offset($agStart)
            ->limit($agLimit)->innerJoin('');
    }

    public function getModelData($params)
    {

        $agFiltre = $params[4];

        $this->createQuery($params);

        $this->getDqlRelations();

        $this->applyFilter($agFiltre);

        $result = $this->_result->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();

        //print_r($result);die;

        $result = $this->changeResponse($result);

        return array('cant' => $this->_result->count(), 'data' => $result);
    }

    public function getDqlRelations()
    {

        $this->_result->addSelect('ne.nombre as nombreestadoinicial')
            ->innerJoin('a.NomEstado ne on ne.idestado = a.idestadoinicial');

        $this->_result->addSelect('nei.icono as iconoestadoinicial')
            ->innerJoin('a.NomEstado nei on nei.idestado = a.idestadoinicial');

        $this->_result->addSelect('ne1.nombre as nombreestadofinal')
            ->innerJoin('a.NomEstado ne1 on ne1.idestado=a.idestadofinal');

        $this->_result->addSelect('nef.icono as iconoestadofinal')
            ->innerJoin('a.NomEstado nef on nef.idestado=a.idestadofinal');

        $this->_result->addSelect('drt.idrol, drt.obligatorio')->leftJoin(
            'a.DatRolTransicion drt'
        );
        $this->_result->addSelect('sr.idrol,sr.denominacion,sr.abreviatura')
            ->leftJoin('drt.SegRol sr');
        $this->_result->addSelect(
            'npr.idproceso as idproceso,npr.denominacion as nombreproceso'
        )->leftJoin(
            'a.NomProceso npr'
        );

        $this->_alias['nombreestadoinicial'] = 'ne.nombre';
        $this->_alias['nombreestadofinal'] = 'ne1.nombre';
        $this->_alias['nombreproceso'] = 'npr.denominacion';
    }

    public function applyFilter($agFiltre)
    {
        $idestructura = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;

        $where = array("idestructura = $idestructura");

        foreach ($agFiltre as $value) {
            // Si el tipo de dato es booleano reformatearlo a 0 o 1
            $type = $value['data']['type'];
            if ($type === 'boolean') {
                $value['data']['value'] = $value['data']['value'] == 'true' ? 1
                    : 0;
            }
            // reformatear con el alias
            $elements = explode('.', $value['field']);
            $alia = '';
            if (isset($alias[$elements[0]])) {
                $alia = $alias[$elements[0]] . '.';
                array_shift($elements);
            }

            if ($this->_alias[$value['field']]) {
                array_pop($elements);
                $elements[] = $this->_alias[$value['field']];
            }

            $valueField = $alia . implode('.', $elements);

            //Definiendo operador ha utilizar en la condicion
            $comparison = $value['data']['comparison'];
            $operator = $this->getOperator($comparison);
            $where[] = $this->addToWhere($type, $valueField, $value, $operator);
        }

        if(count($where)){
            $this->_result->addWhere(implode(' AND ', $where));
        }
    }

    private function addToWhere($type, $valueField, $value, $operator)
    {
        if ($type === 'numeric') {
            return $valueField . "" . $operator . "" . $value['data']['value'];
        } else {
            if ($type === 'date') {
                list($moth, $day, $year) = explode(
                    '/', $value['data']['value']
                );
                return $valueField . "" . $operator . "'$day/$moth/$year'";
            } else {
                return $valueField . " ILIKE '%" . $value['data']['value']
                    . "%'";
            }
        }
    }

    private function getOperator($comparison)
    {
        $operator = " = ";
        if ($comparison) {
            if ($comparison === 'lt') {
                $operator = " < ";
            } else {
                if ($comparison === 'gt') {
                    $operator = " > ";
                }
            }
        }
        return $operator;
    }

    public function changeResponse($result)
    {
        foreach ($result as $k => $v) {
            $roles = $v['DatRolTransicion'];
            $rolesInexists=[];
            $result[$k]['roles']=[];
            foreach ($roles as $w) {
                if($w['SegRol']) {
                    $w['SegRol']['obligatorio']=$w['obligatorio']=='1';
                    $result[$k]['roles'][] = $w['SegRol'];
                }else{
                    $rolesInexists[]=$w['idroltransicion'];
                }
            }
            if(count($rolesInexists))DatRolTransicion::deleteRolTransicion($rolesInexists);
            unset($result[$k]['DatRolTransicion']);
        }

        return $result;
    }

    public function getTransitions($idrol, $idEstadoInicial = false,
        $identificador = null,$idestructura = null
    ) {
        try {
            $estructura = ZendExt_GlobalConcept::getInstance()->Estructura;
            $idestructura = $idestructura ? $idestructura
                : $estructura->idestructura;
            $today = date('d/m/Y');
            $query = new Doctrine_Query();
            $query->select(
                'nt.*, ne.*, ne2.nombre as estadoinicial, ne2.icono as iconoestadoinicial, ne2.acciones,drt.*'
            )
                ->from('NomTransicion nt')
                ->innerJoin('nt.DatRolTransicion dat')
                ->innerJoin('nt.NomEstado ne ON nt.idestadofinal = ne.idestado')
                ->innerJoin(
                    'nt.NomEstado ne2 ON nt.idestadoinicial = ne2.idestado'
                )
                ->innerJoin('nt.NomProceso np ON np.idproceso = nt.idproceso')
                ->innerJoin('nt.DatRolTransicion drt')
                ->where(
                    'ne.fechainicio <= ? AND (ne.fechafin >= ? OR ne.fechafin IS NULL) AND idestructura = ?',
                    array($today, $today, $idestructura)
                )
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY);

            if (!is_null($identificador)) {
                $query->andWhere('np.identificador=?', $identificador);
            }

            if (!empty($idrol)) {
                $idrol = !is_array($idrol) ? array($idrol) : $idrol;
                $query->andWhereIn('dat.idrol', $idrol);
            }

            if ($idEstadoInicial) {
                $query->andWhere(
                    'nt.idestadoinicial = ?', array($idEstadoInicial)
                );
            }

            return $query->execute();

        } catch (Doctrine_Exception $e) {
            throw $e;
            return -1;
        }
    }

    public function getEstadoTransicionesPermisos($idproceso, $idsrol,
        $indexby = true, $idestructura = null
    ) {
        try {
            $estructura = ZendExt_GlobalConcept::getInstance()->Estructura;
            $idestructura = $idestructura ? $idestructura
                : $estructura->idestructura;
            $addindexby = '';
            if (!$idproceso) {
                return array();
            }
            if ($indexby) {
                $addindexby = ' INDEXBY ne.idestado';
            }

            $query = Doctrine_Query::create()
                ->select('ne.*, nt.*,rt.*')
                ->from('NomEstado ne' . $addindexby)
                ->leftJoin(
                    'ne.NomTransicion nt ON nt.idestadoinicial = ne.idestado OR nt.idestadofinal = ne.idestado'
                )
                ->leftJoin('nt.DatRolTransicion rt')
                ->leftJoin('nt.NomProceso np')
                ->where(
                    'np.identificador =? AND nt.idestructura =?',
                    array($idproceso, $idestructura)
                );

            if ($idsrol) {
                if (!is_array($idsrol)) {
                    $idsrol = [$idsrol];
                }

                $query->addWhere('rt.idrol IN (' . implode(",", $idsrol) . ')');
            }

            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

//    public function getEstadoTransicionesPermisos($idproceso, $idsrol, $idestructura=null)
//    {
//        $stringIdsRol = '('.implode(",", $idsrol).')';
//
//        return Doctrine_Query::create()
//            ->select('ne.*, nt.*,rt.*')
//            ->from('NomEstado ne INDEXBY ne.idestado')
//            ->leftJoin('ne.NomTransicion nt ON nt.idestadoinicial = ne.idestado OR nt.idestadofinal = ne.idestado')
//            ->leftJoin('nt.DatRolTransicion rt WITH rt.idrol IN '.$stringIdsRol)
//            ->leftJoin('nt.NomProceso np')
//            ->where('np.identificador =? AND nt.idestructura =?', array($idproceso, $idestructura))
//            ->fetchArray();
//    }
//
//    public function getConfiguracionEstados($idproceso)
//    {
//        $roles = (new SeguridadComunicationInterface())->getRolsByUser($this->global->Perfil->idusuario);
//        $idroles = array();
//        //print_r($roles); die;
//        foreach($roles as $val)
//            array_push($idroles, $val['idrol']);
//        $result = $this->_estadoRepository->getEstadoTransicionesPermisos($idproceso, $idroles, $this->global->Estructura->idestructura);
//        foreach($result as &$value){
//
//            $transicionesAutorizadas = array();
//            foreach($value['NomTransicion'] as $val){
//                if(empty($val['DatRolTransicion']) || $val['idestadofinal'] == $value['idestado'])
//                    continue;
//                $rolesobligatorios=array();
//                $datosrolesobligatorios=$this->obtenerRolesObligatorios(array('idtransicion'=>$val['idtransicion']));
//                foreach($datosrolesobligatorios as $rol){
//                    $rolesobligatorios[]=$rol['idrol'];
//                }
//                array_push($transicionesAutorizadas,
//                    array(
//                        'idestado'=>$val['idestadofinal'],
//                        'notificar'=>$val['notificar'],
//                        'rolesobliatorios'=>$rolesobligatorios
//                    ));
//            }
//
//            unset($value['NomTransicion']);
//            $value['transiciones'] = $transicionesAutorizadas;
//            $value['acciones'] = Zend_Json::decode($value['acciones']);
//        }
//        return $result;
//    }

    public function obtenerRolesObligatorios($params){
        $query = Doctrine_Query::create()
            ->select('rt.idrol')
            ->from('DatRolTransicion rt')
            ->where(
                'rt.idtransicion =? AND rt.obligatorio = 1',
                array($params['idtransicion'])
            );
        return $query->fetchArray();
    }

    public function obtenerDatosRolesObligatorios($params){
//        $datosrolesobligatorios=NomTransicion::obtenerRolesObligatorios($params);
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
//        $respuesta=array();
//        foreach($datosrolesobligatorios as $rol) {
        $respuesta = $conexionActual->fetchAll(
            "SELECT DISTINCT u.nombreusuario, eur.idrol, r.denominacion as rol, u.email as correo
                    FROM mod_seguridad.dat_entidadusuariorol eur
                    LEFT JOIN mod_seguridad.seg_rol r ON eur.idrol=r.idrol
                    LEFT JOIN mod_crmcontratacion.dat_roltransicion rt ON (rt.idrol=eur.idrol)
                    LEFT JOIN mod_seguridad.seg_usuario u ON (u.idusuario=eur.idusuario)
                    WHERE rt.idtransicion IN (" . implode(',',$params['idtransiciones']) . ") 
                    AND u.email IS NOT NULL
                    ORDER BY rol"
        );
//      ADD??????  AND rt.obligatorio=1


//        $respuesta = $conexionActual->fetchAll(
//            "SELECT DISTINCT u.nombreusuario, c.contacto, eur.idrol, r.denominacion as rol,
//                    p.nombre||' '||p.papel||' '||p.sapel  as persona, c.contacto as correo
//                    FROM mod_seguridad.dat_entidadusuariorol eur
//                    LEFT JOIN mod_seguridad.seg_rol r ON eur.idrol=r.idrol
//                    LEFT JOIN mod_crmcontratacion.dat_roltransicion rt ON (rt.idrol=eur.idrol)
//                    LEFT JOIN mod_seguridad.seg_usuario u ON (u.idusuario=eur.idusuario)
//                    LEFT JOIN mod_persona.dat_persona p ON (p.idpersona=u.idpersona)
//                    LEFT JOIN mod_persona.dat_contacto c ON (c.idpersona=p.idpersona)
//                    WHERE rt.idtransicion IN (" . implode(',',$params['idtransiciones']) . ") AND rt.obligatorio=1
//                    AND c.oficial=1 AND c.idtipomediocontacto=2 ORDER BY rol"
//        );
//            $respuesta=array_merge($respuesta, $contactos);
//        }
        return $respuesta;
    }

    public function obtenerDatosSiguientesRolesObligatorios($params){
        $transicion = Doctrine::getTable('NomTransicion')->find($params['idtransicion']);
        $respuesta=array();
        if($transicion){
            $query = Doctrine_Query::create()
                ->select('*')
                ->from('NomTransicion t')
                ->where(
                    't.idestadoinicial =? AND t.idproceso = ? AND t.fechafin IS NULL',
                    array($transicion['idestadofinal'], $transicion['idproceso'])
                );
            $nexttransicion=$query->fetchArray();
            if(count($nexttransicion)){
                $idtransiciones=array();
                foreach ($nexttransicion as $tran){
                    $idtransiciones[]=$tran['idtransicion'];
//                    $respuesta=array_merge($respuesta, NomTransicion::obtenerDatosRolesObligatorios($tran));
                }
                $respuesta=NomTransicion::obtenerDatosRolesObligatorios(array('idtransiciones'=>$idtransiciones));
            }
        }
//        print_r($respuesta);die;
        return $respuesta;
    }

    public function obtenerDatosInicialRolesObligatorios($params){
        try {
            $respuesta=array();
            $query = Doctrine_Query::create()
                ->select('*')
                ->from('NomTransicion t')
                ->innerJoin('t.NomEstado e ON (e.idestado = t.idestadoinicial AND e.inicial=1)')
                ->where(
                    't.idproceso = ? AND t.fechafin IS NULL',
                    array($params['idproceso'])
                );
//            print($query->getSqlQuery());die;
            $transicioninicial=$query->fetchArray();
//            print_r(count($transicioninicial));die;
            if(count($transicioninicial)){
                $idtransiciones=array();
                foreach ($transicioninicial as $tran){
                    $idtransiciones[]=$tran['idtransicion'];
                }
                $respuesta=NomTransicion::obtenerDatosRolesObligatorios(array('idtransiciones'=>$idtransiciones));
            }
            return $respuesta;
        }catch (Exception $e){
            throw $e;
        }
    }

}
