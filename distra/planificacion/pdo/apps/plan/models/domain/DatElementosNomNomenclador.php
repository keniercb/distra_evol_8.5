<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatElementosNomNomenclador extends BaseDatElementosNomNomenclador
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatActividades',
            array('local' => 'idelemento', 'foreign' => 'idactividad')
        );
    }

    public function Buscar($idelemento)
    {
        $temp = $this->conn->getTable('DatElementosNomNomenclador')->find(
            $idelemento
        );
        return $temp->toArray();

    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosNomNomenclador')->execute();
        return $result->toArray();

    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosNomNomenclador')->limit(
            $limite = 10
        )->offset($inicio = 0)->execute();
        return $result->toArray();

    }

    public function ActualizarElemNom(
        $idelemento, $tiponomenclador, $idnomenclador
    )
    {
        $query = Doctrine_Query::create();
        $query->update('DatElementosNomNomenclador')->set(
            'idnomenclador', $idnomenclador
        )->where(
            'idelemento =? AND tiponomenclador = ?',
            array($idelemento, $tiponomenclador)
        )->execute();
    }

    public function EliminarElemNom($idelemento)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatElementosNomNomenclador ')
            ->addWhere('idelemento =?', $idelemento)
            ->execute();
    }

    public function EliminarElemNomActividad($idelemento)
    {
        //	print_r($idelemento);
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatElementosNomNomenclador nom')
            ->where("nom.tiponomenclador = 5 AND nom.idelemento = $idelemento ")
            ->execute();
    }

    public function GetDatosDatElemenNomenclador($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosNomNomenclador')
            ->where("idelemento = ?", $idelemento)
            ->execute();
        return $result->toArray();

    }

    static public function DameIdNomencladorDadoTipoNom(
        $idelemento, $tiponomenclador
    )
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosNomNomenclador en')
            ->where(
                'en.idelemento = ? AND en.tiponomenclador = ?',
                array($idelemento, $tiponomenclador)
            )
            ->execute();
        return $result->toArray();
    }

    static public function DameRelacionElemNomPorIdNom($idnomenclador)
    {
        $query = new Doctrine_Query();
        $result = $query
            ->from('DatElementosNomNomenclador en')
            ->where("en.idnomenclador = $idelemento")
            ->execute();
        return $result->toArray();
    }

    public function GetIdNomencladorDatoIdelemento($idelemento, $tipo)
    {
        $query = new Doctrine_Query();
        $result = $query
            ->from('DatElementosNomNomenclador en')
            ->where("en.idelemento = $idelemento AND tiponomenclador = $tipo")
            ->execute()->toArray();
        return $result[0]['idnomenclador'];
    }

    public function GetElementoNomenclador($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from("DatElementosNomNomenclador en")
            ->where("en.idelemento = $idelemento and en.tiponomenclador = 6")
            ->execute();
        $a = $result->toArray();
        if ($a) {
            return $result[0];
        } else {
            return $a;
        }
    }

    public function existeNomencladorSegunId($idNom)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosNomNomenclador enom ')
            ->where("enom.idnomenclador = $idNom")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function existeNomencladorTipo5SegunId($idNom)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosNomNomenclador enom ')
            ->where("enom.idnomenclador = $idNom and enom.tiponomenclador = 5")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function existeActividadSegunId($idElem)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosNomNomenclador enom ')
            ->where("enom.idelemento = $idElem and enom.tiponomenclador = 5 ")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /*public function existeActividadSegunId ( $idElem ) {
		$fechaactual= "'" . date('Y-m-d') . "'";
        $query = new Doctrine_Query();
	$result = $query->from ( 'DatElementosNomNomenclador enom ' )
			->leftjoin ('enom.DatActividades a ')	
			->where ( "enom.idelemento = $idElem 
                                    and enom.tiponomenclador = 5 
                                    and (a.fechafin < $fechaactual 
                                    or a.idactividad = null)" )
                        ->setHydrationMode ( Doctrine :: HYDRATE_ARRAY )
                        ->execute ();
	return $result;
    }*/

    public function ExisteElem_Nom($idelemento, $idNom)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosNomNomenclador enom ')
            ->where(
                "enom.idelemento = $idelemento AND enom.idnomenclador = $idNom"
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function Nomenclador_Operador($idoperador, $operador)
    {
        $operador = (empty($operador) ? '=' : $operador);
        $consulta
            = "SELECT *
        FROM mod_objetivos.nom_operador o";
        if ($idoperador != '') {
            $consulta = $consulta . " WHERE o.idoperador='$idoperador'";
        } else {
            $consulta = $consulta . " WHERE o.operador='$operador'";
        }
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $result = $res->fetchAll();
        return $result;
    }

  public function getOperador($idoperador)
  {
    $consulta
              = " SELECT o.operador
        FROM mod_objetivos.nom_operador o WHERE o.idoperador='$idoperador' ";

    $connA = Doctrine_Manager:: connection();
    $res = $connA->execute($consulta);
    $result = $res->fetchAll();
    return $result[0]['operador'];
  }

    public
    function Nomenclador_Tipo_6($idelemento)
    {
        $consulta
            = "SELECT dat_elementos_nom_nomenclador.idnomenclador
        FROM mod_objetivos.dat_elementos_nom_nomenclador
        WHERE dat_elementos_nom_nomenclador.tiponomenclador = 6 
        AND dat_elementos_nom_nomenclador.idelemento = '$idelemento'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $result = $res->fetchAll();

        return $result;
    }

    public function cargarRecursosSinAsociar($params)
    {
        $cadenaSelectTotal = 'SELECT idnomenclador, denominacion, indicador, um,
                                count(*) over() as total
                                from';
        $cadenaSelect
            = " (SELECT nom.idnomenclador, nom.dennomenclador AS denominacion,
             0 AS indicador, um.abreviaturaunidadmedida AS um
            FROM mod_objetivos.nom_nomenclador nom
            LEFT JOIN mod_objetivos.dat_usuario_nom_nomenclador dunom
            ON (nom.idnomenclador = dunom.idnomenclador
                AND dunom.idusuario = {$params->idusuario})
            LEFT JOIN  mod_objetivos.dat_nomencladorunidadmedida nu
            ON nu.idnomenclador = nom.idnomenclador
            LEFT JOIN  mod_datosmaestros.nom_unidadmedida um
            ON nu.idunidadmedida = um.idunidadmedida ";

        $cadenaWhere
            = " WHERE (nom.idusuariocrea = {$params->idusuario}
            OR dunom.idusuario = {$params->idusuario})
            AND nom.tiponomenclador = 5
            AND nom.idnomenclador = nom.idpadre ";

        $cadenaUnion
            = " UNION
            SELECT i.idindicador AS idnomenclador, i.denominacion,
            1 AS indicador, um.abreviaturaunidadmedida AS um
            FROM mod_datosmaestros.nom_indicador i
            INNER JOIN mod_datosmaestros.nom_unidadmedida um
            ON(i.idumedida = um.idunidadmedida) 
            INNER JOIN mod_datosmaestros.nom_indicadorplanif inplanif
            ON(i.idindicador = inplanif.idindicador)
            WHERE inplanif.nivelplanif = '1' AND
            inplanif.idaprobacion = '4' ";

        if ($params->estamodificando == 1) {
            $cadenaWhere
                .= " AND nom.idnomenclador NOT IN (SELECT idnomenclador
                FROM mod_objetivos.dat_elementos_nom_nomenclador
                WHERE idelemento = {$params->idactividad}
                AND tiponomenclador = 5) ";

            $cadenaUnion
                .= " AND i.idindicador NOT IN (SELECT  idindicador
                FROM mod_objetivos.dat_elementoindicador
                WHERE idelemento =  {$params->idactividad}) ";
        }
        $cadenaOrder = ") as total ORDER BY indicador ";
        $cadenalimit = " LIMIT(" . $params->limit . ") OFFSET(" . $params->start . ") ";
        $consulta = $cadenaSelectTotal . $cadenaSelect . $cadenaWhere . $cadenaUnion . $cadenaOrder . $cadenalimit;
        //print_r($consulta); die;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $result = $res->fetchAll();
        return $result;
    }

    public function cargarRecursosSinAsociarOld($params)
    {
        $cadenaSelect
            = " SELECT nom.idnomenclador, nom.dennomenclador AS denominacion,
             0 AS indicador, um.abreviaturaunidadmedida AS um,
             count (*) over() as total
            FROM mod_objetivos.nom_nomenclador nom
            LEFT JOIN mod_objetivos.dat_usuario_nom_nomenclador dunom
            ON (nom.idnomenclador = dunom.idnomenclador
                AND dunom.idusuario = {$params->idusuario})
            LEFT JOIN  mod_objetivos.dat_nomencladorunidadmedida nu
            ON nu.idnomenclador = nom.idnomenclador
            LEFT JOIN  mod_datosmaestros.nom_unidadmedida um
            ON nu.idunidadmedida = um.idunidadmedida ";

        $cadenaWhere
            = " WHERE (nom.idusuariocrea = {$params->idusuario}
            OR dunom.idusuario = {$params->idusuario})
            AND nom.tiponomenclador = 5
            AND nom.idnomenclador = nom.idpadre ";

        $cadenaUnion
            = " UNION
            SELECT i.idindicador AS idnomenclador, i.denominacion,
            1 AS indicador, um.abreviaturaunidadmedida AS um,
            count (*) over() as total
            FROM mod_datosmaestros.nom_indicador i
            INNER JOIN mod_datosmaestros.nom_unidadmedida um
            ON(i.idumedida = um.idunidadmedida) 
            INNER JOIN mod_datosmaestros.nom_indicadorplanif inplanif
            ON(i.idindicador = inplanif.idindicador)
            WHERE inplanif.nivelplanif = '1' AND
            inplanif.idaprobacion = '4'";

        if ($params->estamodificando == 1) {
            $cadenaWhere
                .= " AND nom.idnomenclador NOT IN (SELECT idnomenclador
                FROM mod_objetivos.dat_elementos_nom_nomenclador
                WHERE idelemento = {$params->idactividad}
                AND tiponomenclador = 5) ";

            $cadenaUnion
                .= " AND i.idindicador NOT IN (SELECT  idindicador
                FROM mod_objetivos.dat_elementoindicador
                WHERE idelemento =  {$params->idactividad}) ";
        }
        $cadenaOrder = " ORDER BY indicador ";
        $cadenalimit = " LIMIT(" . $params->limit . ") OFFSET(" . $params->start . ") ";
        $consulta = $cadenaSelect . $cadenaWhere . $cadenaUnion . $cadenaOrder . $cadenalimit;
        print_r($consulta);
        die;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $result = $res->fetchAll();
        print_r($result);
        die;
        return $result;
    }

    public function cargarRecursosAsociados($params)
    {
        $consulta
            = " SELECT nom.idnomenclador, nom.dennomenclador AS denominacion,
            um.abreviaturaunidadmedida AS um, 0 AS indicador, en.cantidad
            FROM mod_objetivos.nom_nomenclador nom
            INNER JOIN mod_objetivos.dat_elementos_nom_nomenclador en
            ON(nom.idnomenclador = en.idnomenclador
            AND en.idelemento = {$params->idactividad}
            AND en.tiponomenclador = 5)
            LEFT JOIN mod_objetivos.dat_usuario_nom_nomenclador dunom
            ON (nom.idnomenclador = dunom.idnomenclador
            AND dunom.idusuario = {$params->idusuario})
            LEFT JOIN  mod_objetivos.dat_nomencladorunidadmedida nu
            ON (nu.idnomenclador = nom.idnomenclador)
            LEFT JOIN  mod_datosmaestros.nom_unidadmedida um
            ON nu.idunidadmedida = um.idunidadmedida
            WHERE (nom.idusuariocrea = {$params->idusuario}
            OR dunom.idusuario = {$params->idusuario})
            AND nom.tiponomenclador = 5
            UNION
            SELECT i.idindicador AS idnomenclador, i.denominacion,
            um.abreviaturaunidadmedida AS um, 1 AS indicador,
            ei.cantidad
            FROM mod_datosmaestros.nom_indicador i
            INNER JOIN mod_datosmaestros.nom_unidadmedida um
            ON(i.idumedida = um.idunidadmedida)
            INNER JOIN mod_objetivos.dat_elementoindicador ei
            ON(i.idindicador = ei.idindicador
            AND ei.idelemento = {$params->idactividad})
            ORDER BY indicador ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        if ($params->objeto)
            $result = $res->fetchAll(PDO::FETCH_OBJ);
        else
            $result = $res->fetchAll();
        return $result;
    }

} //fin clase 



