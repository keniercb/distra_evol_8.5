<?php

/**
 *
 */
class MarcamodeloModel extends NomencladoresGeneralesModel
{
    public function MarcamodeloModel()
    {
        parent::ZendExt_Model();
    }

    public function GetMarcas($parametros)
    {
        $datos = NomMarca::GetDatos($parametros);
        $total = NomMarca::GetCantDatos($parametros);
        return array('cantidad' => $total, 'datos' => $datos);
    }

    public function GetModelos($parametros)
    {
        $datos = NomModelo::GetDatos($parametros);
        $total = NomModelo::GetCantDatos($parametros);
        return array('cantidad' => $total, 'datos' => $datos);
    }

    public function InsertarMarca($parametros)
    {

        // false - No duplicado, identificador - Duplicado distinta naturaleza, 'dup' - Dup misma naturaleza
        $parametros['idmarca'] = ($parametros['idmarcaReal']) ? $parametros['idmarcaReal'] : $parametros['idmarca'];
        $denomDuplicada = NomMarca::IsMarcaDuplicada($parametros, false);
        unset($parametros['idmarca']);

        if (!$denomDuplicada) {
            $modelo = new NomMarca();

            $modelo->synchronizeWithArray($parametros);
            /* $relacion = new DatMarcanaturaleza();
             $relacion->synchronizeWithArray($parametros);

             $modelo->DatMarcanaturaleza->add($relacion);*/

            $modelo->save();
        }

        return $denomDuplicada;
    }

    public function InsertarModelo($parametros)
    {

        // false - No duplicado, identificador - Duplicado distinta naturaleza, 'dup' - Dup misma naturaleza
        $denomDuplicada = NomModelo::IsModeloDuplicado($parametros, false);
        unset($parametros['idmarca']);

        if (!$denomDuplicada) {
            $modelo = new NomModelo();

            $modelo->synchronizeWithArray($parametros);

            $relacion = new DatMarcamodelo();
            $relacion->idmarca = $parametros['idpadre'];
            /*$relacion->idnaturaleza = $parametros['idnaturaleza'];*/

            $modelo->DatMarcamodelo->add($relacion);

            $modelo->save();
        }

        return $denomDuplicada;
    }

    public function ModificarMarca($parametros)
    {
        // false - No duplicado, identificador - Duplicado distinta naturaleza, 'dup' - Dup misma naturaleza
        $denomDuplicada = NomMarca::IsMarcaDuplicada($parametros, true);

        if (!$denomDuplicada /*|| $denomDuplicada == $parametros['idmarca']*/) {
            $modelo = Doctrine::getTable('NomMarca')->find($parametros['idmarca']);

            $modelo->synchronizeWithArray($parametros);
            $modelo->save();

            return 1;
        }

        return $denomDuplicada;
    }

    public function ModificarModelo($parametros)
    {
        // false - No duplicado, identificador - Duplicado distinta marca, 'dup' - Dup misma marca
        $denomDuplicada = NomModelo::IsModeloDuplicado($parametros, true);

        if (!$denomDuplicada || $denomDuplicada == $parametros['idmodelo']) {
            $modelo = Doctrine::getTable('NomModelo')->find($parametros['idmodelo']);

            $modelo->synchronizeWithArray($parametros);
            $modelo->save();

            return 1;
        }

        return $denomDuplicada;
    }

    public function DuplicarMarcaPorNaturaleza($parametros)
    {
        $relMarcaNaturaleza = new DatMarcanaturaleza();
        $relMarcaNaturaleza->idmarca = $parametros['idmarcadupl'];
        $relMarcaNaturaleza->idnaturaleza = $parametros['idnaturaleza'];

        $relMarcaNaturaleza->save();
    }

    public function DuplicarModeloPorMarca($parametros)
    {
        $relMarcaModelo = new DatMarcamodelo();
        $relMarcaModelo->idmarca = $parametros['idpadre'];
        $relMarcaModelo->idmodelo = $parametros['idmodelodupl'];
        /*$relMarcaModelo->idnaturaleza = $parametros['idnaturaleza'];*/

        $relMarcaModelo->save();
    }

    public function getMarcamodeloPorIdPadre($parametros)
    {
        $params = (array)json_decode(stripcslashes($parametros['params']));

        if ($parametros['node'] == 0) {

            return NomMarca::GetDatos($params);
        } else {
            $params['idpadre'] = $parametros['node'];
            return NomModelo::GetDatos($params);
        }
    }

    public function EliminarMarca($parametros, $modificar = array())
    {
        $marcas = ($parametros['idnom']) ? json_decode(stripcslashes($parametros['idnom'])) : $parametros;
        foreach ($marcas as $key => $idmarca) {

            try {
                Doctrine::getTable('NomMarca')->find($idmarca)->delete();
            } catch (Exception $e) {
                array_push($modificar, $idmarca);
                continue;
            }
        }
        return true;
    }

    public function EliminarModelo($parametros, $modificar = array())
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        $modelos = json_decode(stripcslashes($parametros['idnom']));

        foreach ($modelos as $key => $idmodelo) {
            $relacion = NomModelo::GetRealacionesModelo($idmodelo);

            if (count($relacion->toArray()) == 0) {
                try {
                    Doctrine::getTable('NomModelo')->find($idmodelo)->delete();
                } catch (Doctrine_Connection_Pgsql_Exception $e) {
                    if ($e->getCode() == '23503') {
                        //ger
                        unset($parametros[$key]);
                        $modificar[] = $idmodelo;

                        if ($conn->getTransactionLevel() != 0) {
                            $conn->rollBack();
                        }

                        $modelos['idnom'] = $modelos;
                        self::EliminarModelo($modelos, $modificar);
                    }
                }
            } else {

                Doctrine::getTable('DatMarcamodelo')->findByDql(
                /* 'idmodelo = ? and idnaturaleza = ? and idmarca = ?',
                 array($idmodelo, $parametros['idnaturaleza'], $parametros['idmarca'])*/
                    'idmodelo = ? and idmarca = ?',
                    array($idmodelo, $parametros['idmarca'])
                )->delete();
            }
        }

        if ($modificar) {

            $conn = Zend_Registry::get('conexion');

            $arr = implode(',', $modificar);
            $conn->execute("UPDATE mod_datosmaestros.nom_modelo SET estado = 0 WHERE (idmodelo IN ($arr))");

            return 3;
        }

        return true;
    }
}