<?php

class NomEstado extends BaseNomEstado
{
    private $_error;
    private $_inicial;
    private $_actual;
    private $_iconfile;

    public function setUp()
    {
        $this->hasMany('NomTransicion', array('local' => 'idestado', 'foreign' => 'idestadoinicial'));
        $this->hasMany('NomTransicion', array('local' => 'idestado', 'foreign' => 'idestadofinal'));
 /*       $this->hasMany('SolicitudNegocioEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasMany('DatHitoEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasMany('DatSolicitudPagoEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasMany('ReclamacionEstado',array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasMany('DatArriboEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasMany('PenalizacionEstado', array('local' => 'idestado', 'foreign' => 'idestado'));*/
        parent::setUp();
    }

    public function preInsertValues($params)
    {
        $modify = $this->preModify($params);
        if (!$modify) {
            $this->_error = 'El estado definido como inicial no se puede modificar, debido a que se encuentra en uso.';
            return false;
        } else {
            $this->modifyInitial();
        }
        return $params;
    }

    public function preModifyValues($params)
    {
        $result = $this->preModify($params);
        // print_r($params);
        if (!$result) {
            $this->_error = 'Siempre debe existir un estado inicial';
            return false;
        } else {
            $this->modifyInitial();
        }
        return $params;
    }

    public function preDeleteValues($params)
    {
        $delete = $this->preDelete($params);
        if (!$delete) {
            $this->_error = 'msgUniqueState';

            return false;
        }
        return $params;
    }

    public function preModify($params)
    {
        $this->_inicial = $params['inicial'];
        $idestado = $params['idestado'];
        $modificarAntiguoInicial=false;
        $inicial=Doctrine_Query::create()->select('ne.*')->from('NomEstado ne')
            ->where('ne.inicial=?', 1)->execute();
        if (!empty($idestado)) {
            $estado = Doctrine::getTable('NomEstado')->find($idestado)->toArray();
            if ($estado['inicial'] != $this->_inicial) {
                if ($this->_inicial == 1) {
                    $modificarAntiguoInicial=true;
                }elseif ($this->_inicial == 0){
                    if(count($inicial)==0 || (count($inicial)==1 && $inicial[0]['idestado']==$idestado)){
                        return false;
                    }
                }
            }
        } else {
            if ($this->_inicial == 1) {
                $modificarAntiguoInicial=true;
            }
        }
        if($modificarAntiguoInicial){
            if(count($inicial)){
                $instance = Doctrine::getTable('NomEstado')->find($inicial[0]['idestado']);
                if ($instance) {
                    $instance->inicial = 0;
                    $instance->save();
                }
            }
        }
        return true;
    }

    public function preModify1($params)
    {
        $this->_inicial = $params['inicial'];
        $idestado = $params['idestado'];
        $execute = true;
        $result = array();
        //  print_r($idestado);die;
        //print_r($this->_inicial);die;

        $query = new Doctrine_Query();
        $query->select('ne.*,nt1.*,nt2.*')->from('NomEstado ne')
            ->leftJoin('ne.NomTransicion nt1 on ne.idestado=nt1.idestadoinicial')
            ->leftJoin('ne.NomTransicion nt2 on ne.idestado=nt1.idestadofinal')
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY);

        if (!empty($idestado)) {
            $estado = Doctrine::getTable('NomEstado')->find($idestado)->toArray();
            if ($estado['inicial'] != $this->_inicial) {
                if ($this->_inicial == 1) {
//                    $estado['inicial']=1;
                    $query->where('ne.inicial=?', $this->_inicial);
                } else {
//                    $estado['inicial']=0;
                    $this->_actual = true;
                    $execute = false;
                }
            } else {
                $execute = false;
            }
        }
//        print_r($estado);die;
        else {
            if ($this->_inicial == 1) {
                $query->where('ne.inicial=?', $this->_inicial);
            } else {
                $execute = false;
            }
        }

        if ($execute) {
            $result = $query->execute();
//            print_r($result);die;
        }
//        if($estado['inicial']==1){
//            return true;
//        }
//        return false;

        return count($result[0]['NomTransicion']) != 0 ? false : true;

    }

    public function preDelete($params)
    {
        settype($params, 'array');
        $idestado = json_decode($params['idestado']);
        foreach ($idestado as $id) {
            $estado = Doctrine::getTable('NomEstado')->find($id)->toArray();
            if ($estado['inicial'] == 1) {
                return false;
            }
        }
        return true;
    }

    public function modifyInitial()
    {
        if ($this->_inicial == 1) {
            $query = new Doctrine_Query();
            $query->update('NomEstado')->where('inicial=?', 1)->set('inicial', 0);
            $query->execute();
        }
    }

    public function getLastError()
    {
        return $this->_error;
    }

    public function getEstadoInicial()
    {
        try {
            $query = new Doctrine_Query();
            $query->select('ne.*')
                ->from('NomEstado ne')
                ->where('ne.inicial = 1')
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY);

            $result = $query->execute();

            return $result[0];
        } catch (Doctrine_Exception $e) {
            throw $e;
            return -1;
        }
    }

    public function getIcons($params, $iconfile)
    {
        $result = array();
        $file = $params['file'];
        if ($file == 'ini') {
            if (file_exists($iconfile[$file])) {
                $icons = parse_ini_file($iconfile[$file], true);
                foreach ($icons as $icon) {
                    $result[] = $icon;
                }

                return array('data' => $result, 'count' => count($icons));
            }
            throw new Exception('No existe el fichero con los iconos');
        } else {
            if (file_exists($iconfile[$file])) {
                $content = file_get_contents($iconfile[$file], true);
                $pattern = '/icondistra-(\w+)\:before/i';
                preg_match_all($pattern, $content, $captura);
                foreach($captura[1] as $icon){
                    $icons[]['name'] = $icon;
                }

                return array('data' => $icons, 'count' => count($icons));
            }
            throw new Exception('No existe el fichero con los iconos');
        }
    }

    public function getEstadoByParams($params){
        try {
            $query = new Doctrine_Query();
            $query->select('ne.*')
                ->from('NomEstado ne')
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY);

            $where = $this->getFilter($params);
            if ($where) {
                $query->where($where);
            }
            return $query->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getFilter($params)
    {
        $filter = [];
        foreach ($params as $key => $value) {
            $filter[] = $key . '=' . $value;
        }
        return implode(' AND ', $filter);
    }

    public function getEstadoFirmado(){
        try{
            return $this->getEstadoByAction('sign');
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }

    public function getEstadoTrabajoTerminado(){
        try{
            return $this->getEstadoByAction('endedwork', false);
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }

    public function getEstadoByAction($action, $soloUno=true){
        try{
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $query = "SELECT n.*,VALUE FROM mod_crmcontratacion.nom_estado n,json_array_elements(n.acciones) ac WHERE VALUE::VARCHAR = '\"$action\"'";
            if($soloUno){
                return $conexionActual->fetchOne($query);
            }else{
                return $conexionActual->fetchAll($query);
            }
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }

    public function obtenerContenidoCorreo($params){
        $estado=Doctrine::getTable('NomEstado')->find($params['idestado']);
        $result=array(
            'cuerpo'=>$params['identificacion'].' ha arribado al estado <b style="color:#3158a0">'.$estado['nombre'].'</b>.',
            'destinatarios'=>$params['destinatarios'],
            'attachment'=> $params['attachment']
        );
        return $result;
    }

}
