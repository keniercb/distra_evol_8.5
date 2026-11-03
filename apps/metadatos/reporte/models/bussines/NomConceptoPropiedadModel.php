<?php

/**
 * Class NomConceptopropiedadModel
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class NomConceptoPropiedadModel extends ZendExt_Model
{
    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new NomConceptopropiedad();
    }

    /**
     * Descripción del método: Devuelve un arreglo con la información asociada al identificador de la tabla.
     *
     * @modify    : Ing. Pedro Alberto Jiménez
     *
     * @param $idconceptopropiedad
     *
     * @return array, devuelve un arreglo con los campos referencia e identificador.
     * @copyright Copyright (c) 2013 xetid
     */
    static function buscarConceptoPropiedad($idconceptopropiedad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select p.referencia, p.identificador from mod_estructuracomp.nom_propiedad p
            inner join mod_estructuracomp.nom_conceptopropiedad cp on (cp.idpropiedad = p.idpropiedad)
            where cp.idconceptopropiedad = $idconceptopropiedad";
        $info = $conn->fetchAll($sql);
        return $info[0];
    }

    /**
     * Descripción del método: Devuelve el próximo identificador de la tabla
     *
     * @author     : Ing. Pedro Alberto Jiménez
     * @return int, identificador.
     * @copyright  Copyright (c) 2013 xetid
     */
    public function buscarIdProximo()
    {
        $query = Doctrine_Query::create();
        $result = $query->select('max(a.idconceptopropiedad) as maximo')->from('NomConceptopropiedad a')->execute()
                        ->toArray();
        $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;
        return $proximo;
    }

    /**
     * Descripción del método: Devuelve la los where y los inner a utilizar en la selección de los valores a
     * graficar.
     *
     * @author     : Ing. Pedro Alberto Jiménez
     *
     * @param $idcptopropiedad
     * @param $identificador
     * @param $idvalores
     * @param $idconcepto
     *
     * @return string, cadena con la restricción.
     * @copyright  Copyright (c) 2013 xetid
     */
    static function getCondValuesByPro($idcptopropiedad, $identificador, $idvalores, $idconcepto)
    {
        $where = "p.$identificador in (" . $idvalores . ")";
        $inner = "";
        if ($idcptopropiedad == 10 || $idcptopropiedad == 15 || $idcptopropiedad == 12) {
            $where .= " and d.idconcepto = $idconcepto ";
            $inner .= " inner join mod_estructuracomp.dat_estructura d
                on(d.idorgano = p.idorgano and p.idconcepto = $idconcepto)";
        } else {
            if ($idcptopropiedad == 21 || $idcptopropiedad == 23) {
                $where .= " and d.idconcepto = $idconcepto";
                $inner .= " inner join mod_estructuracomp.dat_estructuraop d
                 on(d.idorgano = p.idorgano and p.idconcepto = $idconcepto)";
            } else {
                $inner .= NomConceptoPropiedadModel::condicionesConceptoCargo($idcptopropiedad, $inner, $identificador);
            }
        }
        $whereInner['where'] = $where;
        $whereInner['inner'] = $inner;
        return $whereInner;
    }

    /**
     * Descripción del método: Devuelve los inner a utilizar en la selección de los valores para el concepto
     * cargos.
     *
     * @author     : Ing. Pedro Alberto Jiménez
     *
     * @param $idconceptopropiedad
     * @param $inner
     * @param $identificador
     *
     * @return string, cadena con la restricción.
     * @copyright  Copyright (c) 2013 xetid
     */
    function condicionesConceptoCargo($idconceptopropiedad, $inner, $identificador)
    {
        if ($idconceptopropiedad == 1 || $idconceptopropiedad == 4 || $idconceptopropiedad == 5 ||
            $idconceptopropiedad == 6
        ) {
            $inner .= " inner join mod_estructuracomp.dat_cargo dc on(dc.$identificador = p.$identificador)";
        } else {
            if ($idconceptopropiedad == 3) {
                $inner .= " inner join mod_estructuracomp.dat_cargomilitar cm on(cm.idgrado = p.idgrado)";
            } else {
                if ($idconceptopropiedad == 2) {
                    $inner .= " inner join mod_estructuracomp.dat_cargocivil cc on(cc.idcategocup = p.idcategocup)";
                }
            }
        }
        return $inner;
    }
}