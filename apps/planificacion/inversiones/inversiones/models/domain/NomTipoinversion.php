<?php

class NomTipoinversion extends BaseNomTipoinversion {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('ConfFormatoetapa', array('local' => 'idformatoetapa', 'foreign' => 'idformatoetapa'));
        $this->hasOne('DatInversion', array('local' => 'idtipoinversion', 'foreign' => 'idtipoinversion'));
    }

    public function getByid($idtipoinversion) {
        return Doctrine::getTable('NomTipoinversion')->find($idtipoinversion)->toArray();
    }

    public function denomExistente($denominacion) {

        $sql_query = "SELECT idtipoinversion, denominacion, idformatoetapa FROM mod_planifinversiones.nom_tipoinversion
WHERE denominacion='$denominacion';";

        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);

        if (count($result->data) != 0) {
            return true;
        } else {
            return false;
        }
    }

    public function adicionartipodeinversion($objdatonomenclador) {
        $objdatonomenclador->save();
    }

    public function listarprincipal($param) {
        $ADDWHERE = "";
        $condiciones = array();
        $p = $param['filtros'];
        foreach ($p as $key => $datos) {
            if ($datos['field'] == 'denominacion') {
                $condiciones[] = "upper(n.denominacion) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } elseif ($datos['field'] == 'donemformato') {
                $condiciones[] = "n.idformatoetapa= " . ($datos['data']['value']);
            } elseif ($datos['field'] == 'uso' && $datos['data'] ['value'] == 'Si') {
                $comparar = 1;
                $condiciones[] = "(SELECT count (idinversion) as contador 
                 FROM mod_planifinversiones.dat_inversion  where n.idtipoinversion = d.idtipoinversion)>0 ";
            } elseif ($datos['field'] == 'uso' && $datos['data'] ['value'] == 'No') {
                $condiciones[] = "(SELECT count (idinversion) as contador 
                 FROM mod_planifinversiones.dat_inversion  where n.idtipoinversion = d.idtipoinversion)=0 ";
            }
        }
        $ADDWHERE = ' WHERE TRUE ';
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . ' AND ' . $condicion;
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT(n.idtipoinversion),n.denominacion,n.idformatoetapa,m.denominacion as donemformato, n.iddocumentos, np.denominacion as denomdoc,
                 case when (SELECT count (idinversion) as contador 
                 FROM mod_planifinversiones.dat_inversion  where n.idtipoinversion = d.idtipoinversion)>0 then 1 else 0 end as uso
                 FROM mod_planifinversiones.nom_tipoinversion n
                 INNER JOIN mod_planifinversiones.conf_formatoetapa m ON(m.idformatoetapa=n.idformatoetapa) 
                 LEFT JOIN  mod_planifinversiones.dat_inversion d ON(d.idtipoinversion= n.idtipoinversion)
                 LEFT JOIN mod_datosmaestros.dat_documentoprim dp on ( n.iddocumentos = dp.iddoc)
                 LEFT JOIN mod_datosmaestros.nom_docprim np on (dp.iddocumentos = np.iddocumentos)
                  $ADDWHERE
                 ";
        $data = $conn->execute($query);
        $data = $data->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function eliminarTipoInversion($idtipoinversion) {
        $query = Doctrine_Query::create();
        $result = $query->delete('NomTipoinversion')
                ->from('NomTipoinversion')
                ->whereIn('idtipoinversion', $idtipoinversion)
                ->execute();
    }

    public function actualizar($params) {

        $objCondicion = Doctrine::getTable('NomTipoinversion')->find($params['idtipoinversion']);
        $objCondicion->idformatoetapa = $params['idformatoetapa'];
        $objCondicion->denominacion = $params['denominacion'];
        $objCondicion->save();
    }


    public function cargarDocPrimarios($params) {
        $query = Doctrine_Query::create();
        $result = $query->delete('NomTipoinversion')
            ->from('NomTipoinversion')
            ->whereIn('idtipoinversion', $idtipoinversion)
            ->execute();
    }

    public function ActualizarTipoInversion($iddoc,$tipo) {
        $query = new Doctrine_Query ();
        $result = $query->update('NomTipoinversion')
            ->set('iddocumentos', $iddoc)
            ->where('idtipoinversion=? ', $tipo)
            ->execute();
        return true;
    }

}
