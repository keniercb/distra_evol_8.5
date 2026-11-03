<?php

class ConfFormatoetapa extends BaseConfFormatoetapa {

    public function setUp() {
        parent :: setUp();
        $this->hasMany('DatEtapa', array('local' => 'idformatoetapa', 'foreign' => 'idformatoetapa'));
        $this->hasMany('NomTipoinversion', array('local' => 'idformatoetapa', 'foreign' => 'idformatoetapa'));
    }

    public function getByid($idformatoetapa) {
        return Doctrine::getTable('ConfFormatoetapa')->find($idformatoetapa); //->toArray();
    }

    public function denomExistente($param) {
        $query = new Doctrine_Query();
        return $query->select("fe.denominacion")
                        ->from("ConfFormatoetapa fe")
                        ->where("fe.denominacion=?", $param['denominacion'])
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function getFormatosEtapa($param) {
        $query = new Doctrine_Query();

        $p = $param['filtros'];
        foreach ($p as $key => $datos) {
            if ($datos['field'] == 'denominacion') {
                $query->addWhere("upper(fe.denominacion)  LIKE '%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'descripcion') {
                $query->addWhere("upper(fe.descripcion)  LIKE '%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'activado' && $datos['data']['value'] == 'Si') {
                $query->addWhere('fe.activado=?', 1);
            } else if ($datos['field'] == 'activado' && $datos['data']['value'] == 'No') {
                $query->addWhere('fe.activado=?', 0);
            } else if ($datos['field'] == 'aprobado' && $datos['data']['value'] == 'Si') {
                $query->addWhere('fe.aprobado=?', 1);
            } else if ($datos['field'] == 'aprobado' && $datos['data']['value'] == 'No') {
                $query->addWhere('fe.aprobado=?', 0);
            } else if ($datos['field'] == 'uso' && $datos['data']['value'] == 'Si') {
                $query->addWhere('fe.uso=?', 1);
            } else if ($datos['field'] == 'uso' && $datos['data']['value'] == 'No') {
                $query->addWhere('fe.uso=?', 0);
            }
        }

        return $query->select("fe.*")
                        ->from("ConfFormatoetapa fe")
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->orderBy("fe.idformatoetapa")
                        ->execute();
    }

    public function getFormatosEtapaC($param) {
        $ADDWHERE = "";
        $condiciones = array();
        $p = $param['filtros'];
        foreach ($p as $key => $datos) {
            if ($datos['field'] == 'denominacion') {
                $condiciones[] = "upper(f.denominacion) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'descripcion') {
                $condiciones[] = "upper(f.descripcion) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'activado' && $datos['data']['value'] == 'Si') {
                $condiciones[] = "f.activado=1";
            } else if ($datos['field'] == 'activado' && $datos['data']['value'] == 'No') {
                $condiciones[] = "f.activado=0";
            } else if ($datos['field'] == 'aprobado' && $datos['data']['value'] == 'Si') {
                $condiciones[] = "f.aprobado=1";
            } else if ($datos['field'] == 'aprobado' && $datos['data']['value'] == 'No') {
                $condiciones[] = "f.aprobado=0";
            } elseif ($datos['field'] == 'uso' && $datos['data'] ['value'] == 'Si') {
                $condiciones[] = "(SELECT count (idformatoetapa) as contador 
                     FROM mod_planifinversiones.nom_tipoinversion  where t.idformatoetapa = f.idformatoetapa)>0 ";
            } elseif ($datos['field'] == 'uso' && $datos['data'] ['value'] == 'No') {
                $condiciones[] = "(SELECT count (idformatoetapa) as contador 
                     FROM mod_planifinversiones.nom_tipoinversion  where t.idformatoetapa = f.idformatoetapa)=0 ";
            }
        }

        $ADDWHERE = ' WHERE TRUE ';
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . ' AND ' . $condicion;
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT(f.idformatoetapa), f.denominacion,f.descripcion,f.activado,f.aprobado ,
                     case when (SELECT count (idformatoetapa) as contador 
                     FROM mod_planifinversiones.nom_tipoinversion  where t.idformatoetapa = f.idformatoetapa)>0 
                     then 1 else 0 end as uso
                     FROM  mod_planifinversiones.conf_formatoetapa f
                     LEFT JOIN  mod_planifinversiones.nom_tipoinversion t ON(t.idformatoetapa= f.idformatoetapa)
                      $ADDWHERE ";
        $data = $conn->execute($query);
        $data = $data->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function getFormatosEtapaClac() {
        $query = new Doctrine_Query();
        return $query->select("fe.*")
                        ->from("ConfFormatoetapa fe")
                        ->where("fe.aprobado=1")
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->orderBy("fe.idformatoetapa")
                        ->execute();
    }

    public function AprobarDes($parametros) {
        $query = new Doctrine_Query ();
        $result = $query->update('ConfFormatoetapa n')
                ->set('aprobado', $parametros['idaprobado'])
                ->where('idformatoetapa=? ', $parametros['idcomponente'][0])
                ->execute();
        return true;
    }

    public function ActivarDes($parametros) {
        $query = new Doctrine_Query ();
        $result = $query->update('ConfFormatoetapa n')
                ->set('activado', $parametros['idactivado'])
                ->where('idformatoetapa=? ', $parametros['idcomponente'][0])
                ->execute();
        return true;
    }

}
