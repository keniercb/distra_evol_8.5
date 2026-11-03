<?php

class DatFlujotrabajo extends BaseDatFlujotrabajo {

    public function setUp() {
        parent :: setUp();
        $this->hasMany('DatEtapa', array('local' => 'idflujotrabajo', 'foreign' => 'idflujotrabajo'));
        $this->hasMany('DatTransicion', array('local' => 'idflujotrabajo', 'foreign' => 'idflujotrabajo'));
    }

    public function getByid($idflujotrabajo) {
        return Doctrine::getTable('DatFlujotrabajo')->find($idflujotrabajo)->toArray();
    }

    public function cargarFlujosTrab($param) {
        $query = new Doctrine_Query();
        return $query->select("dft.*")
                        ->from("DatFlujotrabajo dft")
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public static function insertarNuevoFlujo($parametros) {

        $nomFlujo = new DatFlujotrabajo();
        $nomFlujo->denominacion = $parametros['denominacion'];
        $nomFlujo->descripcion = $parametros['descripcion'];
        $nomFlujo->save();
        return true;
    }

    public function devolverFlujos($parametros) {

        $start = $parametros['start'];
        $limit = $parametros['limit'];

        $query = Doctrine_Query::create();
        $strSel = "ft.idflujotrabajo,ft.denominacion,ft.descripcion";



        foreach ($parametros['filtros'] as $datos) {
            if ($datos['field'] == 'denominacion') {
                $query->addWhere(" ft.idflujotrabajo  =" . ($datos['data']['value']));
            } else if ($datos['field'] == 'descripcion') {
                $query->addWhere("upper( ft.descripcion ) LIKE '%" . strtoupper($datos['data']['value']) .
                        "%' ");
            } else if ($datos['field'] == 'uso') {
                $flujosetapares = DatEtapa::flujosEtapa();
                $flujosetapa = array();
                foreach ($flujosetapares as $k => $value) {
                    $flujosetapa[$k] = $value['idflujotrabajo'];
                }
                if ($datos['data']['value'] == 'Si') {
                    $query->whereIn('ft.idflujotrabajo', $flujosetapa);
                } else {
                    $query->whereNotIn('ft.idflujotrabajo', $flujosetapa);
                }
            }
        }
        if (!$start && !$limit) {
            $start = 0;
            $limit = 200;
        }
        $query->from('DatFlujotrabajo ft')
                ->offset($start)
                ->limit($limit);

        $cant = $query->select('ft.idestadosft,ft.denominacion,ft.descripcion')
                ->count();

        $res['cantidad'] = $cant;
        $res['datos'] = array();
        $res['datos'] = $query->select($strSel)
                ->fetchArray();
        return $res;
    }

    public static function setFlujo($parametros) {
        $actualizarFlujo = Doctrine::getTable('DatFlujotrabajo')->find($parametros['idflujotrabajo']);
        $actualizarFlujo->denominacion = $parametros['denominacion'];
        $actualizarFlujo->descripcion = $parametros['descripcion'];
        $actualizarFlujo->save();
    }

    public static function deleteFlujo($parametros) {
        $enuso = false;
        foreach ($parametros as $value) {
            $id = $value->idflujo;
            if (!DatEtapa::flujoEnUso($value->idflujo)) {
                $sql_query1 = "DELETE FROM mod_planifinversiones.dat_transicion
 WHERE idflujotrabajo='$id';";
                $sql_query = "DELETE FROM mod_planifinversiones.dat_flujotrabajo
 WHERE idflujotrabajo='$id';";
                $conn = Doctrine_Manager::connection();
                $conn->execute($sql_query1)->fetchAll(PDO::FETCH_ASSOC);
                $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
            } else {
                return $enuso = true;
            }
        }
        if ($enuso) {
            return true;
        } else {
            return false;
        }
    }

    public static function existeFlujo($nombre) {
        $sql_query = "SELECT * FROM mod_planifinversiones.dat_flujotrabajo
 WHERE denominacion='$nombre';";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) != 0) {
            return true;
        } else {
            return false;
        }
    }

}
