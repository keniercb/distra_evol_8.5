<?php

class DatFactor extends BaseDatFactor
{

    public function setUp()
    {
        parent :: setUp ();
        $this->hasOne ('NomFactorclave', array ('local' => 'idfactorclave', 'foreign' => 'idfactorclave'));
        $this->hasOne ('DatMatrizdofa', array ('local' => 'idmatrizdofa', 'foreign' => 'idmatrizdofa'));
    }

    public function getByid($idfactor)
    {
        return Doctrine::getTable('DatFactor')->find($idfactor);
    }

    public function getFactoresByAmbito($params){
        $idambitodofa = $params['idambitodofa'];
        $limit = $params['limit'];
        $start = $params['start'];
        $analista = $params['analista'];
        $idestudiomatriz = $params['idestudiomatriz'];

        /////variables buscar///////
        $denominacion = $params['denominacion'];
        $factorclave = $params['factorclave'];
        /////variables buscar///////

        $_query = Doctrine_Query::create();
        $_query->select('fact.*,nom.denominacion as denomNomFactor')
            ->from('DatFactor fact')
            ->innerJoin('fact.DatMatrizdofa md')
            ->innerJoin('fact.NomFactorclave nom')
            ->orderby('fact.idfactor DESC')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        if ($idambitodofa != '') {
            $_query->addWhere("md.idambitodofa = ?", $idambitodofa);
        }
        if ($idestudiomatriz != '') {
            $_query->addWhere("md.idestudiomatrizdofa = ?", $idestudiomatriz);
        }
        if ($analista != '') {
            $_query->addWhere("md.analista = ?", $analista);
        }
        if ($denominacion != '') {
            $_query->addWhere("fact.denominacion LIKE '%$denominacion%'");
        }
        if ($factorclave != '') {
            $_query->addWhere("fact.idfactorclave = ?", $factorclave);
        }

        $totalCount = count($_query->execute());
        $_query->limit($limit)
            ->offset($start);
        $result = $_query->execute();

        return array('cantidad_filas' => $totalCount, 'root' => $result);


    }

    public function salvarFactor($obj){
        $obj->save();
        return $obj->idfactor;
    }

    public function eliminarFactor($obj) {
        try {
            if ($obj) {
                $obj->delete();
                return true;
            }
            return false;
        } catch (Exception $e) {
            return $e;
        }
    }

    public function getFortalezasDebilidades($params){
        $idambitodofa = $params['idambitodofa'];
        $idestudiomatriz = $params['idestudiomatriz'];
        $analista = $params['analista'];
        $param1 = $params['parametro1'];
        $param2 = $params['parametro2'];

        $_query = Doctrine_Query::create();
        $_query->select('fact.denominacion,nom.descripcion as descripcion')
            ->from('DatFactor fact')
            ->innerJoin('fact.DatMatrizdofa md')
            ->innerJoin('fact.NomFactorclave nom')
            ->where('md.analista = ?',$analista)
            ->addWhere('md.idestudiomatrizdofa = ?',$idestudiomatriz)
            ->addWhere('md.idambitodofa = ?',$idambitodofa)
            ->addWhere('nom.descripcion = ? OR nom.descripcion = ?',array($param1,$param2))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        $result = $_query->execute();



        $totalCount = count($result);

        return array('cantidad_filas' => $totalCount, 'root' => $result);
    }

}

