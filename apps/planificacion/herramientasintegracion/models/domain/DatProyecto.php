<?php

class DatProyecto extends BaseDatProyecto
{
    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name eliminarProyecto
     * @param $idP :Identificador del proyecto
     * @return bool
     */
    static function eliminarProyecto($idP)
    {
        try {
            $q = Doctrine_Query::create();
            $q->delete()->from('DatProyecto p')->where('p.idproyecto =?', $idP)->execute();
            return true;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }

    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatEstudiomatrizrelacion', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatEstudiocurvaconflicto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatEstudiocausaefecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatEstudiomatrizdofa', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatEstudiomatrizimpactocruzado', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatEstudiomatrizfmpeir', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatEstudiomatrizdanalisispolitico', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatEstudiogantt', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
    }

    public function getByid($idproyecto)
    {
        return Doctrine::getTable('DatProyecto')
            ->find($idproyecto)
            ->toArray();
    }

    public function getAHP($idproyectoahp)
    {
        return Doctrine::getTable('DatProyectoahp')->find($idproyectoahp);
    }

    public function getByDenominacion($denominacion)
    {
        $query = Doctrine_Query::create();
        $query->select('p.*')->from('DatProyecto p')->where('p.denominacion = ?', $denominacion);
        return $query->execute()->getFirst();
    }

    public function getProyectosByConcepto($concepto, $start = 0, $limit = 20)
    {
        try {
            $tabla = $concepto['concepto'];
            $campo = $concepto['campoid'];
            $nativo = $concepto['nativo'];
            $asociado = (isset($concepto['conceptoAsociado'])) ? $concepto['conceptoAsociado'] : null;
            $tablaAsociado = $concepto['conceptoAsociado'];
            $campoAsociado = $concepto['campoidAsociado'];
            $idconceptoAsociado = $concepto['idconceptoAsociado'];
            $date = date('d/m/Y');
            $q = Doctrine_Query::create();
            if ($asociado) {
                $q->select('p.*, tp.*')
                    ->from('DatProyecto p')
                    ->innerJoin("p.$tabla tp")
                    ->innerJoin("p.$tablaAsociado ta")
                    ->where("ta.$campoAsociado = ? and (p.fechafin is NULL or p.fechafin > ?)", array($idconceptoAsociado, $date))
                    ->orderBy('p.idproyecto desc')
                    ->offset($start)->limit($limit)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
                $res = $q->execute();

                $q1 = Doctrine_Query::create();
                $q1->select('count( p.idproyecto) as cantidad')
                    ->from('DatProyecto p')
                    ->innerJoin("p.$tabla tp")
                    ->innerJoin("p.$tablaAsociado ta")
                    ->where("ta.$campoAsociado = ? and (p.fechafin is NULL or p.fechafin > ?)", array($idconceptoAsociado, $date))
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
                $res1 = $q1->execute();

            } else {
                $q->select('p.*, tp.*')
                    ->from('DatProyecto p')
                    ->innerJoin("p.$tabla tp")
                    ->where("tp.nativo = ? and (p.fechafin is NULL or p.fechafin > ?)", array($nativo, $date))
                    ->orderBy('p.idproyecto desc')
                    ->offset($start)->limit($limit)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
                $res = $q->execute();

                $q1 = Doctrine_Query::create();
                $q1->select('count( p.idproyecto) as cantidad')
                    ->from('DatProyecto p')
                    ->innerJoin("p.$tabla tp")
                    ->where("tp.nativo = ? and (p.fechafin is NULL or p.fechafin > ?)", array($nativo, $date))
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
                $res1 = $q1->execute();

            }

            if ($concepto['campoid'] == 'idproyectoahp') {
                foreach ($res as $k => $value) {
                    $res[$k]['foco'] = $value[$concepto['concepto']][0]['foco'];
                }
            } else if ($concepto['campoid'] == 'idestudiocurvaconflicto') {
                foreach ($res as $k => $value) {
                    $res[$k]['escala'] = $value[$concepto['concepto']][0]['escala'];
                }
            }

            return array("root" => $res, "cantidad_filas" => $res1[0]['cantidad']);
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }
}