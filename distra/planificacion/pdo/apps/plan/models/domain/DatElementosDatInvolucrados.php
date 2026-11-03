<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatElementosDatInvolucrados extends BaseDatElementosDatInvolucrados
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatElementos',
            array('local' => 'idelemento', 'foreign' => 'idelemento')
        );
        $this->hasOne(
            'DatInvolucrados',
            array('local' => 'idinvolucrado', 'foreign' => 'idinvolucrado')
        );
    }

    public function Buscar($idelemento)
    {
        $temp = $this->conn->getTable('DatElementosDatInvolucrados')->find(
            $idelemento
        );
        return $temp->toArray();

    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatInvolucrados')->execute();
        return $result->toArray();

    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatInvolucrados')->limit(
            $limite = 10
        )->offset($inicio = 0)->execute();
        return $result->toArray();
    }

    public function GetInvolucrados($idelemento, $idinvolucrado)
    {
        $array = array(0 => $idelemento, 1 => $idinvolucrado);
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatInvolucrados')->where(
            "idelemento = ? and idinvolucrado = ?", $array
        )->execute();
        return $result->toArray();

    }

    public function GetInvolucrados1($idelemento, $idinvolucrado)
    {
        $array = array(0 => $idelemento, 1 => $idinvolucrado);
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatInvolucrados')->where(
            "idelemento = ? and idinvolucrado = ?", $array
        )->execute();
        return $result;
    }

    public function GetInvolucradosPorIdElemento($idelemento)
    {
        try {
            $array = array(0 => $idelemento);
            $query = new Doctrine_Query();
            $result = $query->select('idinvolucrado')->from(
                'DatElementosDatInvolucrados'
            )->where("idelemento = ?", $array)->execute();

            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }

    }

    public function ObtenerInvolucradosPorElemento($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatInvolucrados ')->where(
            "idelemento = ?", $idelemento
        )->execute();
        return $result->toArray();
    }

    public function GetElementosPorIdInvolucrado($llaveinvolucrado)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatInvolucrados ei')->where(
            "ei.llaveinvolucrado = $llaveinvolucrado "
        )->execute();
        //print_r($result);die():
        return $result->toArray();
    }

    public function EliminarRelInvoElem($idelemento, $idinvolucrado)
    {
        $query = new Doctrine_Query();
        $result = $query->delete('DatElementosDatInvolucrados')
            ->from('DatElementosDatInvolucrados d')
            ->where(
                'd.idelemento = ? and d.idinvolucrado = ?',
                array($idelemento, $idinvolucrado)
            )
            ->execute();
    }


    public function ExisteInvolucradoConElementos(
        $idusuariocrea, $idinvolucradoresp, $idinvolucradoejec, $tipoelemento,
        $fechainiciob, $fechafinb, $denominacionb
    ) {
        if ($idusuariocrea != 0) {
            $cadena
                = "(ei.idinvolucrado = $idinvolucradoresp 
                    OR ei.idinvolucrado = $idinvolucradoejec 
                        OR e.idusuariocrea = $idusuariocrea )";
        }
        if ($idusuariocrea == 0) {
            $cadena
                = " ei.idinvolucrado = $idinvolucradoresp 
                    OR ei.idinvolucrado = $idinvolucradoejec ";
        }
        if ($denominacionb != null) {
            $cadena .= " AND e.denelemento LIKE '%$denominacionb%' ";
        }

        if ($tipoelemento == 3) {
            if ($fechainiciob != null) {
                $cadena .= " AND a.fechainicio >= '$fechainiciob' ";
            }
            if ($fechafinb != null) {
                $cadena .= " AND a.fechafin <= '$fechafinb'";
            }

            $query = new Doctrine_Query();
            $result = $query->select("idelemento")->from("DatElementos e")
                ->innerJoin("e.DatActividades a")
                ->leftJoin("e.DatElementosDatInvolucrados ei ")
                ->where("e.idtipoelemento = $tipoelemento AND " . $cadena)
                ->setHydrationMode(
                    Doctrine::HYDRATE_ARRAY
                )///;die($result->getSqlQuery());
                ->execute();
            return $result;
        }
        if ($tipoelemento == 2) {
            if ($fechainiciob != null) {
                $cadena .= " AND f.fechaemision >= '$fechainiciob' ";
            }
            if ($fechafinb != null) {
                $cadena .= " AND f.fechacumplimiento <= '$fechafinb'";
            }

            $query = new Doctrine_Query();
            $result = $query->from(" DatElementos e ")
                ->innerJoin("e.DatFip f")
                ->leftJoin('e.DatElementosDatInvolucrados ei')
                ->where("e.idtipoelemento = $tipoelemento AND " . $cadena)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            return $result;
        }
        if ($tipoelemento == 0) {
            if ($fechainiciob != null) {
                $cadena .= " AND p.fechainicio >= '$fechainiciob' ";
            }
            if ($fechafinb != null) {
                $cadena .= " AND p.fechafin <= '$fechafinb'";
            }

            $query = new Doctrine_Query();
            $result = $query->from(" DatElementos e ")
                ->innerJoin("e.DatPlanPdo p")
                ->leftJoin('e.DatElementosDatInvolucrados ei')
                ->where("e.idtipoelemento = $tipoelemento AND " . $cadena)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            return $result;
        }
        if ($tipoelemento == 1) {
            if ($fechainiciob != null) {
                $cadena .= " AND f.fechainicio >= '$fechainicio' ";
            }
            if ($fechafinb != null) {
                $cadena .= " AND f.fechafin <= '$fechafinb'";
            }

            $query = new Doctrine_Query();
            $result = $query->from(" DatElementos e ")
                ->innerJoin("e.DatObjetivo o")
                ->leftJoin('e.DatElementosDatInvolucrados ei')
                ->where("e.idtipoelemento = $tipoelemento AND " . $cadena)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            return $result;
        }
    }


    public function ExisteInvolucrado($idinvolucrado, $idelemento)
    {

        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatInvolucrados d')
            ->where(
                " d.idinvolucrado = $idinvolucrado AND d.idelemento = $idelemento"
            )
            ->execute();
        return $result->toArray();

    }

    function datosRelacionElemInvol($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatInvolucrados dedi')
            ->where("dedi.idelemento = $idelemento")
            ->execute();
        return $result->toArray();

    }

    public function ObtenerDatosGruposUsuariosInvolucrados($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from(" DatElementosDatInvolucrados ei ")
            ->innerJoin("ei.DatInvolucrados i")
            ->where("ei.idelemento = $idelemento")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    function datosRelacionElemInvolColumn($idelemento)
    {
        $cadena = " SELECT 
                        case when i.idgrupo is not null then gu.idusuario else i.idusuario end as idusuario 
                    FROM mod_objetivos.dat_involucrados i
                    INNER JOIN mod_objetivos.dat_elementos_dat_involucrados ee
                    ON ee.idinvolucrado = i.idinvolucrado AND ee.idelemento = {$idelemento}
		    left joiN mod_objetivos.dat_grupo g ON g.idgrupo = i.idgrupo
		    left join mod_objetivos.dat_grupousuario gu on gu.idgrupo = g.idgrupo";
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        return $res->fetchAll(PDO::FETCH_COLUMN);

    }


} //fin clase 



