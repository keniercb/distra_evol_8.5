<?php

class DocMedicion extends BaseDocMedicion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DocMedCliente', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $array[] = array('cardinalidad' => 'one', 'relation' => 'DocMedicion',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $obj = new DatDocumento();
        UtilesDoctrineModel::tryInyectRelactions($obj, $array);
    }

    /**
     * Listar los documento de mediciones
     * @params $params array
     */
    static public function listar($params)
    {
        $filterArr = array();
        if (!empty($params['iddocumento'])) {
            $filterArr[] = "dm.iddocumento = " . $params['iddocumento'];
        }
        if (!empty($params['idservicio'])) {
            $filterArr[] = "dm.idservicio = " . $params['idservicio'];
        }
        $q = Doctrine_Query::create()
            ->select('dm.*')
            ->from('DocMedicion dm');
        $filter = implode(" and ", $filterArr);
        if ($filter) {
            $q->where($filter);
        }
        $result = $q->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    // ---------------Obtener idservicio dado id del documento----------------------
    static public function buscarIdServicio($iddocumento)
    {
        $q = Doctrine_Query::create()
            ->select('dm.idservicio')
            ->from('DocMedicion dm')
            ->where('dm.iddocumento = ?', $iddocumento)
            ->fetchArray();
        return $q;
    }

    static public function getLastDocumentPreparated($params = Array())
    {
        $select = "";
        if ($params) {
            $select .= ",dmc.*, mc.*";
        }
        $q = Doctrine_Query::create()
            ->select("dm.*,dd.fechacontable as fechacontable $select")
            ->from('DocMedicion dm')
            ->innerjoin('dm.DatDocumento dd');
        if ($params) {
            $q->innerjoin('dm.DocMedCliente dmc')
                ->innerjoin('dmc.MedCliente mc ON dmc.idmedicioncliente = mc.idmedicioncliente');
        }
        $q->where('dd.estado =?', array(2));
        if ($params) {
            $q->addWhere("dm.idservicio =? and mc.idcliente =?", array($params['idservicio'], $params['idcliente']));
        }
        $q->orderBy('dd.iddocumento DESC');
        $result = $q->fetchArray();
        return $result;
    }

    static public function isAnularStatus($params)
    {
        //Ej. 01/09/2014 m/d/y  formato mismo documento / doc de lectura       
        $q = Doctrine_Query::create()
            ->select('dm.*,dd.fechacontable as fechacontable')
            ->from('DocMedicion dm')
            ->innerjoin('dm.DatDocumento dd')
            ->where(
                'dd.estado = 1 and dd.iddocumento >=? and dd.fechacontable =? ',
                array($params['iddocumento'], $params['fechacontable'])
            );
        $result = $q->fetchArray();
        return $result;
    }

    public function buscarSinAprobar($idestructura)
    {
        $query = new Doctrine_Query();
        return $query->from('DocMedicion dm')
            ->innerJoin('dm.DatDocumento dd')
            ->innerJoin('dm.DocMedCliente dmc')
            ->innerJoin('dmc.MedCliente mc')
            ->where('dd.estado = 2 and dd.idestructuracomun = ?', array($idestructura))
            ->fetchArray();
    }
}
