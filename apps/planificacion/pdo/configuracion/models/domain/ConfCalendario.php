<?php

class ConfCalendario extends BaseConfCalendario
{
    public function setUp()
    {
        parent:: setUp();

        $this->hasOne(
            'NomTipoDia', array('local' => 'idtipodia',
                'foreign' => 'idtipodia')
        );
    }

    public function getCalendarioPorEstructura($idestructura, $anno)
    {
        try {
            $query = new Doctrine_Query ();
            $query->select(
                'cf.horas, cf.fechas as fecha, ntp.color, n.dennomenclador as dentipodia, c.idestructura'
            )
                ->from('ConfCalendariofechas cf')
                ->innerJoin('cf.ConfCalendario c')
                ->innerJoin('c.NomTipoDia ntp')
                ->innerJoin('ntp.NomNomenclador n')
                ->where("c.idestructura = $idestructura AND cf.anno = $anno")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            return $query->execute();
        } catch (Exception $e) {
            return 0;
        }
    }

    public function getCalendario($parametros)
    {
        try {
            $idestructura = ($parametros['getByIdEstructura']) ? $parametros['idestructura'] : $parametros['idcalendario'];
            $query = new Doctrine_Query ();
            $cadenawhere = "c.idestructura = $idestructura AND cf.anno = {$parametros['anno']}";
            $cadenawhere .= (isset($parametros['incidencia'])) ? " AND ntp.incidencia = {$parametros['incidencia']}" : '';
            $query->select(
                'cf.horas, cf.fechas as fecha, ntp.color, n.dennomenclador as dentipodia, c.idestructura, cf.horainicio, cf.horafin '
            )
                ->from('ConfCalendariofechas cf')
                ->innerJoin('cf.ConfCalendario c')
                ->innerJoin('c.NomTipoDia ntp')
                ->innerJoin('ntp.NomNomenclador n')
                ->where($cadenawhere);
            return $query->fetchArray();
        } catch (Exception $e) {
            return 0;
        }
    }

    public function existeEstructuraDadoAnno($parametros)
    {
        try {
            $idestructura = ($parametros['getByIdEstructura']) ? $parametros['idestructura'] : $parametros['idcalendario'];
            $anno = $parametros['anno'];
            $query = new Doctrine_Query ();
            $query->select(
                'cf.idcalendario'
            )
                ->from('ConfCalendariofechas cf')
                ->innerJoin('cf.ConfCalendario c')
                ->where("c.idestructura = $idestructura AND cf.anno = $anno")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            return $query->execute();
        } catch (Exception $e) {
            return 0;
        }
    }

    public function eliminar($idcalendario)
    {
        try {
            $calendario = Doctrine::getTable('ConfCalendario')
                ->findByDql(
                    "idcalendario = $idcalendario"
                );
            if (isset ($calendario[0])) {
                $calendario->delete();
                return true;
            }
        } catch (Exception $e) {
            return 0;
        }
    }

    public function eliminarCalendarioPorEstructura($parametros)
    {
        try {
            $idestructura = $parametros['idestructuracompartir'];
            $anno = $parametros['anno'];
            $query = new Doctrine_Query ();
            $row = $query->delete(
                'ConfCalendariofechas'
            )
                ->from('ConfCalendariofechas cf')
                ->innerJoin('cf.ConfCalendario c')
                ->addWhere("c.idestructura = $idestructura AND cf.anno = $anno")
                ->whereIn('idestructura', $idestructura)
                ->execute();

            return $row;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function listarFondoTiempo($params)
    {
        try {
            $query = new Doctrine_Query();
            $result['total'] = $query->from('ConfCalendario cc')
                ->where("cc.denominacion IS NOT NULL")
                ->execute()->count();
            $result['resultado'] = $query->from('ConfCalendario cc')
                ->where("cc.denominacion IS NOT NULL")
                ->offset(
                    $params['start'] ? $params['start'] : 0)
                ->limit($params['limit'] ? $params['limit'] : 20)
                ->execute()->toArray();
            return $result;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function eliminarFondoTiempo($arrayIdElementosEliminar)
    {
        try {
            $idElementosEliminar = implode(',', $arrayIdElementosEliminar);
            $consulta
                = "DELETE FROM mod_objetivos.conf_calendario c
				WHERE (c.idestructura IN ($idElementosEliminar) OR c.idcalendario IN ($idElementosEliminar))";
            $connA = Doctrine_Manager:: connection();
            $res = $connA->execute($consulta);
            return 1;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function eliminarFondoTiempo1($arrayIdElementosEliminar)
    {
        try {
            $query = Doctrine_Query::create();
            $query->delete()
                ->from('ConfCalendario c')
                ->WhereIn('c.idestructura', $arrayIdElementosEliminar)
                ->andWhereIn('c.idcalendario', $arrayIdElementosEliminar)
                ->execute();
            return 1;
        } catch (Exception $e) {
            return 0;
        }
    }
}

?>