<?php

class NomTransferenciaareaentidadModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar($idestructuracomun, $idtipotransferencia)
    {
        $newobject = new NomTransferenciaareaentidad();
        $newobject->idestructuracomun = $idestructuracomun;
        $newobject->idtipotransferencia = $idtipotransferencia;
        $newobject->save();
        $id = $newobject->identifier();
        // echo json_encode($id);die();
        return $id['idtipotransferenciaentidad'];
    }

    public function Modificar($idtipotransferenciaentidad, $idestructuracomun, $idtipotransferencia)
    {
        $query = Doctrine_Query::create();
        $datos = $query->update('NomTransferenciaareaentidad a')
                ->set('a.idestructuracomun', "'$idestructuracomun'")
                ->set('a.idtipotransferencia', "'$idtipotransferencia'")
                ->where(
                        "a.nom_transferenciaareaentidad = '$idtipotransferenciaentidad'"
                )
                ->execute();
        return $datos;
        ;
    }

    public function Eliminar($idtipotransferenciaentidad)
    {
        $query = Doctrine_Query::create();
        $datos = $query->delete('a.*')
                ->from('NomTransferenciaareaentidad a')
                ->where(
                        "a.idtipotransferenciaentidad = ? ", array($idtipotransferenciaentidad)
                )
                ->execute();
        return $datos;
        //    $NomTransferenciaareaentidadModel->delete();
    }

    public function CargarGrid($start, $limit, $idestructura)
    {
        //echo $idestructura;die;
        $query = Doctrine_Query::create();
        $datos = $query->select('ta.*,c.*')
                ->from('NomTipotransferencia ta')
                ->innerJoin('ta.NomTransferenciaareaentidad b ')
                ->innerJoin('ta.NomTipotransferenciaarea c ')
                ->where("b.idestructuracomun = '$idestructura'")
                ->limit($limit)
                ->offset($start)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();

        return $datos;
    }

    public function CargarGridBuscar($start, $limit, $idestructura, $descripcion, $codigo)
    {
        $sqlwhere = " b.idestructuracomun = '$idestructura' ";
        if ($codigo != '' && $descripcion != '') {
            $sqlwhere = $sqlwhere
                    . " and ta.codigo ='$codigo'
                    and ta.descripcion like '%$descripcion%'";
        } else {
            if ($codigo != '') {
                $sqlwhere = $sqlwhere . " and ta.codigo = '$codigo'";
            } else {
                $sqlwhere = $sqlwhere . " and ta.descripcion like '%$descripcion%'";
            }
        }

        $query = Doctrine_Query::create();
        $datos = $query->select('ta.*,b.*,c.*')
                ->from('NomTipotransferencia ta')
                ->innerJoin('ta.NomTransferenciaareaentidad b ')
                ->innerJoin('ta.NomTipotransferenciaarea c ')
                ->where($sqlwhere)
                ->limit($limit)
                ->offset($start)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $datos;
    }

    static function CantBuscar($idestructura, $descripcion, $codigo)
    {

        $sqlwhere = " b.idestructuracomun = '$idestructura' ";
        if ($codigo != '' && $descripcion != '') {
            $sqlwhere = $sqlwhere
                    . " and ta.codigo ='$codigo'
                    and ta.descripcion like '%$descripcion%'";
        } else {
            if ($codigo != '') {
                $sqlwhere = $sqlwhere . " and ta.codigo = '$codigo'";
            } else {
                $sqlwhere = $sqlwhere . " and ta.descripcion like '%$descripcion%'";
            }
        }
        $query = Doctrine_Query::create();
        $datos = $query->select('count(*) as cant')
                ->from('NomTipotransferencia ta')
                ->innerJoin('ta.NomTransferenciaareaentidad b ')
                ->where($sqlwhere)
                ->execute();
        return $datos[0]->cant;
    }

    static function Cant($idestructura)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('count(*) as cant')
                ->from('NomTransferenciaareaentidad t')
                ->where("t.idestructuracomun = '$idestructura'")
                ->execute();
        return $datos[0]->cant;
    }

}
