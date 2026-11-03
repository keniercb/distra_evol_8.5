<?php

class NomDocumentoExpediente extends BaseNomDocumentoExpediente {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatDocumentoExpedienteEntidad', array('local' => 'idexpediente', 'foreign' => 'idexpediente'));
    }

    public function GetDocexpedienteNorte($parametros) {
        
        $where = "";
        $conn = Zend_Registry::get('conexion');
        
        $sql = "select net.*";
        $sqlfrom = " from mod_logactivofijotangible.nom_expedienteactivo net
        ";

        if($parametros['idestructura']){
            $sql.=", case when (select 1 from mod_logactivofijotangible.dat_documentoexpedienteentidad nete
                where net.idexpediente = nete.idexpediente
                and nete.idestructuracomun = {$parametros['idestructura']}) = 1 then true else false end as usarentidad";
        }
        
        if($parametros['denominacion']){
            $WHERE.= "where net.denominacion iLike '%{$parametros['denominacion']}%'";
        }
        if ($parametros['idexpediente']) {
            $WHERE.= " and net.idexpediente = {$parametros['idexpediente']}";
        }
        if ($parametros['culminacion']) {
            $WHERE.= " and net.culminacion = {$parametros['culminacion']}";
        }
        if ($parametros['estado']) {
            $WHERE.= " and net.estado = {$parametros['estado']}";
        }    
        
        if ($parametros['start']) {
                $limit.= " OFFSET " . $parametros['start'];
            }

        if ($parametros['limit']) {
            $limit.= " LIMIT " . $parametros['limit'];
        }
        
        return $conn->execute($sql . $sqlfrom .$WHERE. $limit)->fetchAll(PDO::FETCH_ASSOC);        
    }

    public function GetCantDocexpedienteNorte($parametros) {
        unset($parametros['start']);
        unset($parametros['limit']);

        $query = new Doctrine_Query();
        $query->from('NomDocumentoExpediente net')->leftJoin('net.DatDocumentoExpedienteEntidad nete');

        $query = self::getWhere($query, 'net', $parametros);

        return $query->count();
    }

    public function GetDocexpedienteSur($parametros) {
        $query = new Doctrine_Query();
        $query->from('NomEstatusoperativo neo')->innerJoin('neo.DatEstatustecnicoEstatusoperativo deteo')->innerJoin(
                'deteo.NomEstatustecnico net'
        );

        $query->addSelect(
                'neo.idestatusoperativo as id, neo.idestatusoperativo, neo.denominacion, neo.estado, deteo.disponible as disponible, deteo.afectacdt as afectacdt, deteo.pordefecto as pordefecto'
        );

        $query->orderBy('neo.idestatusoperativo DESC');

        $query = self::getWhere($query, 'neo', 'net', 'deteo', $parametros);

        return $query->fetchArray();
    }

    public function GetCantDocexpedienteSur($parametros) {
        unset($parametros['start']);
        unset($parametros['limit']);

        $query = new Doctrine_Query();
        $query->from('NomEstatusoperativo neo')->innerJoin('neo.DatEstatustecnicoEstatusoperativo deteo')->innerJoin(
                'deteo.NomEstatustecnico net'
        );

        $query = self::getWhere($query, 'neo', 'net', 'deteo', $parametros);

        return $query->count();
    }

    private function getWhere($query, $alias, $parametros) {        
   
        if (!$query) {
            $query = new Doctrine_Query();
            $query->from("NomDocumentoExpediente {$alias}");
        }

        if ($parametros['denominacion']) {
            $query->addWhere("{$alias}.denominacion iLike '%{$parametros['denominacion']}%'");
        }
        if ($parametros['query']) {
            $query->addWhere("{$alias}.denominacion iLike '%{$parametros['query']}%'");
        }
        if ($parametros['idexpediente']) {
            $query->addWhere("{$alias}.idexpediente = ?", array($parametros['idexpediente']));
        }

        if ($parametros['culminacion']) {
            $query->addWhere("{$alias}.culminacion = ?", array($parametros['culminacion']));
        }

        if ($parametros['estado']) {
            $query->addWhere("{$alias}.estado = ?", array($parametros['estado']));
        }  

        if ($parametros['limit']) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }

        return $query;
    }

    public function getColores() {
        $query = new Doctrine_Query();
        $query->select('idexpediente, denominacion')->from('NomDocumentoExpediente');

        return $query->fetchArray();
    }

    public function ObtenerColoresID($colores) {

        $in = "( ";
        $i = 0;
        foreach ($colores as $a) {
            if ($i == 0) {
                $in = $in . $a;
            } else {
                $in = $in . ", " . $a;
            }
            $i++;
        }
        $in .= " )";

        //  print_r($in);die;

        $sql
                = "select color.denominacion, color.idcolor
                from mod_logactivofijotangible.nom_color color
                 where rol.idcolor in " . $in;

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);

        return $result;
    }

    public function getColoresHabilitados($iddenom = 'idcolor') {
        $query = new Doctrine_Query();
        $query->select("
        c.idcolor as {$iddenom},
        c.estado as estado,
        c.denominacion as denominacion"
                )
                ->from('NomColor c')->where('c.estado = 1');

        return $query->fetchArray();
    }

    public function getColoresHabilitadosEntidad($idestructura) {

        $query = new Doctrine_Query();
        $query->from('NomColor c')
                ->innerJoin('c.DatColorEntidad ent')
                ->where('c.estado = 1 and ent.idestructuracomun = ?', $idestructura);

        return $query->fetchArray();
    }

}
