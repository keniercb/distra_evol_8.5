<?php

/**
 * Componente para gestionar las unidades de medida de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Unidadmedida/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class DatConversion extends BaseDatConversion
{

    /**
     * Constuctor de la clase
     */
    public function setUp()
    {

        parent::setUp();

        $this->HasOne(
            'DatConversion', array(
                'local' => 'idunidadmedida', 'foreign' => 'idunidadmedida'
            )
        );
        $this->HasOne(
            'DatConversion', array(
                'local'   => 'idunidadmedidaconversion',
                'foreign' => 'idunidadmedida'
            )
        );
    }

    /**
     * Obtener factores de conversión
     *
     * @param  int   $idunidadmedida Identificador unidad de medida de origen
     * @param  array $umasociadas    Arreglo de identificadores de unidades de medidas asociadas
     *
     * @return array Retorna un arreglo con los factores de conversión
     *
     */
    public function getFactoresConversionDadoUM($idunidadmedida, $umasociadas)
    {

        $query = Doctrine_Query::create();
        $result = array();
        foreach ($umasociadas as $um) {
            $aux = $query->select(
                'c.idunidadmedidaconversion as um, c.factorconversion as fconversion'
            )
                ->from('DatConversion c')
                ->where('c.idunidadmedida = ?', $idunidadmedida)
                ->addWhere(
                    'c.idunidadmedidaconversion = ?', $um [idunidadmedida]
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            array_push($aux, $um [denominacionunidadmedida]);
            if ($aux [1] != null) {
                $arreglo = array();
                $arreglo ['idunidadmedida'] = $aux [0] [um];
                $arreglo ['denominacionunidadmedida'] = $aux [1];
                $arreglo ['factorconversion'] = $aux [0] [fconversion];
                array_push($result, $arreglo);
            } else {
                if ($idunidadmedida != $um [idunidadmedida]) {
                    $arreglo = array();
                    $arreglo ['idunidadmedida'] = $um [idunidadmedida];
                    $arreglo ['denominacionunidadmedida']
                        = $um [denominacionunidadmedida];
                    array_push($result, $arreglo);
                }
            }
        }
        return $result;
    }

    /**
     * Invertir factor de conversión
     *
     * @param  double $factor Factor de conversión
     *
     * @return double Retorna 1 entre el factor de conversión
     *
     */
    public function invertirFactor($factor)
    {
        return 1 / $factor;
    }

    public function existeConversion()
    {
        $query = Doctrine_Query::create();
        $cant = $query->select("cp.idunidadmedidaconversion")
            ->from('DatConversion cp')
            ->count();
        return $cant;
    }

    public function obtenerFactorBaseDadoidUmedida($idumedida)
    {
        $conver = Doctrine::getTable('DatConversionum')->findByDql(
            "idunidadmedidaconversion = {$idumedida}"
        )->toArray();
        return $conver[0]['factorconversion'];

    }

    public function salvarDatos($datos)
    {
        /*try {
            $conv = Doctrine::getTable('DatConversion')->findByDql(
                "idunidadmedidaconversion = {$datos['idumedidadestino']} AND idunidadmedida = {$datos['idumedidaorigen']}"
            )->toArray();
            $conver = Doctrine::getTable('DatConversionum')->findByDql(
                "idunidadmedidaconversion = {$datos['idumedidadestino']}"
            )->toArray();

            if (count($conv) == 0) {
                if (count($conver) == 0) {
                    $converUm = new DatConversion();

                    $converUm->idunidadmedidaconversion
                        = $datos['idumedidadestino'];
                    $converUm->idunidadmedida = $datos['idumedidaorigen'];
                    $converUm->factorconversion = $datos['factorbase'];
                    if ($datos['idumedidaorigen'] == $datos['idumindicador']) {
                        $converUm->factorbase = $datos['factorbase'];
                    } else {
                        $datcon = Doctrine::getTable('DatConversionum')
                            ->findByDql(
                                "idumedidadestino = {$datos['idumedidaorigen']} and idindicador = {$datos['idindicador']}"
                            )->toArray();

                        $converUm->factorbase
                            = $datos['factorbase'] * $datcon[0]['factorbase'];
                    }
                    $converUm->idindicador = $datos['idindicador'];


                    $converUm->save();
                    return true;
                } else {
                    return 3;
                }

            } else {
                return 2;
            }
        } catch (Exception $e) {
            return $e;
        }*/
    }

    public function obtenerTodosDatos($params)
    {
        /*$query = Doctrine_Query::create()
            ->from('DatConversionum dc')
            ->innerJoin('dc.NomUnidadmedida num');

        $strSel
            = " dc.factorbase, dc.factorconversion, dc.idumedidaorigen, dc.idumedidadestino,
            num.denominacionunidadmedida as denominacion, num.abreviaturaunidadmedida as abreviatura";

        $query->addSelect('dc.idconversionum');
        $query->addwhere('dc.idindicador = ?', $params['idindicador']);
        $cant = $query->count();
        $res['cantidad'] = $cant;
        $res['datos'] = array();
        if ($params['limit']) {
            $query->offset($params['start'])
                ->limit($params['limit']);
        }

        if ($cant) {
            $res['datos'] = $query->addselect($strSel)
                ->fetchArray();
        }
        return $res;*/
    }

    public function eliminarConversion($idconversion)
    {
        /*try {
            Doctrine_Query::create()
                    ->delete()
                    ->from('DatConversionum')
                    ->where('idconversionum = ?', array($idconversion))
                    ->execute();
            return true;
        } catch (Exception $e) {
            return false;
        }*/
    }

    public function obtenerUMedidasConfIndicador($parametros)
    {
        /*if($parametros['bandera']){
        $sql = "select distinct q.um as idunidadmedida, u.denominacionunidadmedida as nombreum, q.idindicador
                        from (
                        select d.idumedidaorigen as um, d.idindicador
                        from mod_datosmaestros.dat_conversionum d
                        where d.idindicador = {$parametros['idproducto']}
                        union
                        select d.idumedidadestino as um, d.idindicador
                        from mod_datosmaestros.dat_conversionum d
                        where d.idindicador = {$parametros['idproducto']}
                        union
                        select i.idumedida as um, i.idindicador
                        from mod_datosmaestros.nom_indicador i
                         where i.idindicador = {$parametros['idproducto']}) q
                        inner join mod_nomencladores.nom_unidadmedida u on u.idunidadmedida = q.um  ";
        }else{
        $sql = "select distinct d.idumedidadestino as idumedida, d.idindicador, u.denominacionunidadmedida as nombreum
                from mod_datosmaestros.dat_conversionum d
                inner join mod_nomencladores.nom_unidadmedida u on u.idunidadmedida = d.idumedidadestino
                where d.idindicador = {$parametros['idindicador']}
                union
                select m.idunidadmedida as idumedida, i.idindicador, m.denominacionunidadmedida as nombreum
                from mod_datosmaestros.nom_indicador i
                inner join mod_nomencladores.nom_unidadmedida m on m.idunidadmedida = i.idumedida
                where i.idindicador = {$parametros['idindicador']}";
        }
        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        $query->execute();
       return $query->fetchAll(PDO::FETCH_ASSOC);  */
    }
}

