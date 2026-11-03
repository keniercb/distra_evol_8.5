<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatArcDatInvolucrados extends BaseDatArcDatInvolucrados
{
    public function setUp()
    {
        parent::setUp();
    }

    public function Buscar($idarc)
    {
        $temp = $this->conn->getTable('DatArcDatInvolucrados')
            ->find($idarc);
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatInvolucrados')
            ->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatInvolucrados')
            ->limit($limite = 10)
            ->offset($inicio = 0)
            ->execute();
        return $result->toArray();
    }

    static public function ExisteElemento($idarc, $idinvolucrado)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatInvolucrados ai')
            ->where("ai.idarc = $idarc AND ai.idinvolucrado = $idinvolucrado")
            ->execute();
        return $result->toArray();
    }

    public function dameIdARCDadoIdInvolucrado($llaveinvolucrado)
    {
        $query = new Doctrine_Query();
        $result = $query->select('ai.idarc')
            ->from('DatArcDatInvolucrados ai')
            ->where("ai.llaveinvolucrado = $llaveinvolucrado")
            ->execute();
        return $result->toArray();
    }

    /**Dri**9/02/10**/
    public function cargarNivelSup($cadA/*, $idarc*/)
    {
        $query = new Doctrine_Query();
        $result = $query
            ->select(
                'ai.idarc as idarea'
            )
            ->from(
                'DatArcDatInvolucrados ai'
            )//'DatArc a, a.DatArcDatInvolucrados ai'
            ->where("ai.idinvolucrado IN ($cadA)")//"$sqlSoloRaices"
            //->limit($limit)
            //->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        //echo '<pre>'; print_r($result);die;
        return $result;
    }

    public function getcantNivelSup($idInvolucrado, $idarc)
    {
        $sqlSoloRaices = !$idarc
            ? "ai.idinvolucrado = '$idInvolucrado'
            AND a.idarcp = a.idarc"
            : "ai.idinvolucrado = '$idInvolucrado' AND a.idarcp = '$idarc' 
                AND a.idarcp <> a.idarc ";
        $devolverPadre = !$idarc ? "null as _parent" : "a.idarcp as _parent";
        $query = new Doctrine_Query();
        $result = $query
            ->select(
                'ai.idarc as idarea, a.denarc as denom, a.fechainicio as fdesde,
                a.fechafin as fhasta, a.activo as susp, 
                (( a.ordender - a.ordenizq) = 1) as leaf,'
                . $devolverPadre . ''
            )
            ->from('DatArc a, a.DatArcDatInvolucrados ai')
            ->where("$sqlSoloRaices")
            ->execute()->count();
        return $result;
    }

    function buscarNivelSupHijo(
        $idInvolucrado, $denominacion, $fechainicio, $fechafin, $start, $limit
    ) {
        $condicion = false;
        if ($denominacion) {
            $condicion
                = "ai.idinvolucrado = '$idInvolucrado'
                AND upper(a.denarc) LIKE '%"
                . strtoupper($denominacion) . "%'";

            if ($fechainicio) {
                $condicion .= " AND a.fechainicio = $fechainicio";
            }
            if ($fechafin) {
                $condicion .= " AND a.fechafin = $fechafin";
            }
        } elseif ($fechainicio) {
            $fechainicio
                = "ai.idinvolucrado = '$idInvolucrado' 
                    AND a.fechainicio = '$fechainicio'";
            if ($fechafin) {
                $condicion .= " AND a.fechafin = $fechafin";
            }
        } elseif ($fechafin) {
            $fechafin
                = "ai.idinvolucrado = '$idInvolucrado AND estado = $fechafin";
        }
        //  creando la query
        $query = new Doctrine_Query();
        $result = $query->select(
            'ai.idarc as idarea, a.denarc as denom, a.fechainicio as fdesde, 
                a.fechafin as fhasta, a.activo as susp, 1 as _is_leaf'
        )
            ->from('DatArc a, a.DatArcDatInvolucrados ai')
            ->where($condicion)
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function dameInvolucradosDadoIdArc($idarc)
    {
        $query = new Doctrine_Query();
        $result = $query->select('ai.idinvolucrado')
            ->from('DatArcDatInvolucrados ai')
            ->where("ai.idarc = $idarc")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function EliminarInvsDadoIdarc($idarc)
    {
        $query = new Doctrine_Query();
        $result = $query->delete('DatArcDatInvolucrados')
            ->where("idarc = ?", $idarc)
            //->setHydrationMode( Doctrine :: HYDRATE_ARRAY )
            ->execute();
        return $result;
    }

    function  modificarArcInvolucrado($idarc, $idinvolucrado)
    {
        $datArcInv = Doctrine::getTable('DatArcDatInvolucrados')->findByDql(
            'idarc=? and idinvolucrado=?', array($idarc, $idinvolucrado)
        );
        if (is_object($datArcInv)) {
            $datArcInv->idinvolucrado = isset($idinvolucrado) ? $idinvolucrado
                : $datArcInv->$idinvolucrado;
            $datArcInv->save();
            return true;
        }
        return false;
    }


    public function ExisteInvolucradoConArc($idinvolresp)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArc a')
            ->innerJoin('a.DatArcDatInvolucrados ai')
            ->where("ai.idinvolucrado = $idinvolresp")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function datosRelacionARCInvol($idarc)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatInvolucrados dadi')
            ->where("dadi.idarc = $idarc")
            ->execute();
        return $result->toArray();
    }


}//fin clase 



