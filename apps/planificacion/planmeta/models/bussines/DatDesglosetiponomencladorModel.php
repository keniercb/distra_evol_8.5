<?php

class DatDesglosetiponomencladorModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatDesglosetiponomenclador $DatDesglosetiponomenclador
    ) {
        $DatDesglosetiponomenclador->save();
    }

    public function Actualizar(DatDesglosetiponomenclador $DatDesglosetiponomenclador
    ) {
        $DatDesglosetiponomenclador->save();
    }

    public function Eliminar($DatDesglosetiponomenclador) {
        $DatDesglosetiponomenclador->delete();
    }

    public function adicionarDesgloseTipoNom($iddesglose, $tiponomencladoresOrden
    ) {

        foreach ($tiponomencladoresOrden as $tiponomOrden) {
            $nuevoDTN = new DatDesglosetiponomenclador();
            $nuevoDTN->iddesglose = $iddesglose;
            $nuevoDTN->idtiponomenclador = $tiponomOrden->idtiponomenclador;
            $nuevoDTN->orden = $tiponomOrden->orden;
            $nuevoDTN->save();
        }

        return true;
    }
        public function adicionarDesgloseTipoNomAutomatico($iddesglose, $tiponomencladoresOrden
    ) {
        
        foreach ($tiponomencladoresOrden as $key =>$tiponomOrden) {
            $nuevoDTN = new DatDesglosetiponomenclador();
            $nuevoDTN->iddesglose = $iddesglose;
            $nuevoDTN->idtiponomenclador = $tiponomOrden;
            $nuevoDTN->orden = $key+1;
            $nuevoDTN->save();
        }

        return true;
    }

    public function eliminarDesgloseNom($iddesglose) {
        $query = Doctrine_Query::create();
        $query->delete('DatDesglosetiponomenclador')
                ->from('DatDesglosetiponomenclador')
                ->addWhere('iddesglose = ?', $iddesglose)->execute();
    }

    public function eliminarDesgloseTipoNom($iddesglosetiponomenclador) {
        $desgloseTN = Doctrine:: getTable('DatDesglosetiponomenclador')
                ->findByDql($iddesglosetiponomenclador);
        $this->Eliminar($desgloseTN);
        return true;
    }

    public function listar($parametros) {
        $query = new Doctrine_Query();
        $data->data = array();
        $i = 0;
        if ($parametros['orden'] == '-1') {
            /* Listar configuraciones existentes para todas las entidades */
            //DESGLOSES
            $data->data = $query
                            ->from('DatDesglose d')
                            ->orderby('d.denominacion')
                            ->execute()->toArray(true);

            foreach ($data->data as $indice => $valor) {
                $data->data[$indice]['text'] = $valor['denominacion'];
                $data->data[$indice]['leaf'] = false;
                $data->data[$indice]['orden'] = 0;
                $data->data[$indice]['columna'] = null;
                $data->data[$indice]['ident'] = $valor['iddesglose'];
                $data->data[$indice]['tipo'] = 0; //configuracion desglose
            }
        } elseif ($parametros['orden'] == 0) {
            /* Listar desglose del primer nivel existente para la entidad seleccionada, si el desglose tiene
             * desglose por columnas mostrarlo en forma de carpeta, sino en forma de hoja.
             */
            //CONSOLIDADO
            $objetoOrdenUno = DatDesglose::getDatDesglosetiponomenclador(
                            $parametros['iddesglose'], 1
            );
            $idtiponomencladorOrdenUno = $objetoOrdenUno->idtiponomenclador;
            $nomTiponom = NomTiponomenclador::getTipoNomenclador(
                            $idtiponomencladorOrdenUno
            );

            $data->data[$i]['leaf'] = true;
            $iddesglosetnOrdenDos = DatDesglose::getDatDesglosetiponomenclador(
                            $parametros['iddesglose'], 2
                    )->iddesglosetiponomenclador;
            if ($iddesglosetnOrdenDos != null) {
                if ($this->existeDesgloseEntidadOrd2(
                                $parametros['identidad'], $parametros['idespecialidad'], $iddesglosetnOrdenDos
                        ) == true
                ) {
                    $data->data[$i]['leaf'] = false;
                }
            }
            $data->data[$i]['ident'] = $parametros['iddesglose'];
            $data->data[$i]['iddesglosetiponomenclador'] = $objetoOrdenUno->iddesglosetiponomenclador;
            $data->data[$i]['text'] = $nomTiponom->denominacion;
            $data->data[$i]['orden'] = 1;
            $data->data[$i]['tipo'] = null;
            $data->data[$i]['columna'] = "__";
        } elseif ($parametros['orden'] > 0) {
            /* Listar desglose realizados por culmna para la entidad seleccionada
             * si la columna fue desglosada mostrarla como una carpeta sino como una hoja.
             */
            $idtiponomencladorUno = DatDesglose::getDatDesglosetiponomenclador(
                            $parametros['iddesglose'], $parametros['orden']
                    )->idtiponomenclador;

            $denominacionTipoNom = NomTiponomenclador::getTipoNomenclador(
                            DatDesglose::getDatDesglosetiponomenclador(
                                    $parametros['iddesglose'], $orden + 1
                            )->idtiponomenclador
                    )->denominacion;

            $arrayDatosNomExistentes = NomDatosnomenclador::getDatosNomPorIdTipoNom(
                            $idtiponomencladorUno
            );

            $strUrisHijas = "";
            $coma = "";
            if ($parametros['idpadrerama'] != null) {
                foreach ($arrayDatosNomExistentes as $valor) {
                    $strUrisHijas = $strUrisHijas . $coma . "'"
                            . ($parametros['idpadrerama'] . ","
                            . $valor['iddatosnomenclador'])
                            . "'";
                    $coma = ",";
                }
            }
            $desglosetiponomenclador = DatDesglose::getDatDesglosetiponomenclador(
                            $parametros['iddesglose'], $parametros['orden']
                    )->iddesglosetiponomenclador;
            $desglosesExistentes = $this->listarDesglosesExistentesParaArbol(
                    $parametros['identidad'], $parametros['idespecialidad'], $desglosetiponomenclador, $strUrisHijas
            );

            $iddtn = DatDesglose::getDatDesglosetiponomenclador(
                            $parametros['iddesglose'], $parametros['orden'] + 1
                    )->iddesglosetiponomenclador;
            foreach ($desglosesExistentes as $desgloseexistente) {
                $data->data[$i]['ident'] = $parametros['iddesglose'];
                $data->data[$i]['iddesglosetiponomenclador'] = $iddtn;
                $data->data[$i]['text'] = $desgloseexistente['denominacion']
                        . ' (' . $denominacionTipoNom . ')';
                $data->data[$i]['leaf'] = true;
                $desglosetipomonOrdenNMasUno = DatDesglose::getDatDesglosetiponomenclador(
                                $parametros['iddesglose'], $parametros['orden'] + 1
                );
                $tiponomOrdenMasDos = DatDesglose::getDatDesglosetiponomenclador(
                                $parametros['iddesglose'], $parametros['orden'] + 2
                );
                $arrayDatosNomExistentes = NomDatosnomenclador::getDatosNomPorIdTipoNom(
                                $desglosetipomonOrdenNMasUno->idtiponomenclador
                );
                $arrayUrisHijas = array();
                foreach ($arrayDatosNomExistentes as $valor) {
                    $arrayUrisHijas[] = ($desgloseexistente['uridatosnomenclador'] . ","
                            . $valor['iddatosnomenclador']);
                }
                $desglosesExistentesDelhijo = $this->existeDesgloseEntidadOrd2(
                        $parametros['identidad'], $parametros['idespecialidad'], $tiponomOrdenMasDos->iddesglosetiponomenclador, $arrayUrisHijas
                );
                if ($desglosesExistentesDelhijo == true) {
                    $data->data[$i]['leaf'] = false;
                }
                $data->data[$i]['orden'] = $parametros['orden'] + 1;
                $data->data[$i]['tipo'] = null;
                $data->data[$i]['columna'] = '_' . $desgloseexistente['iddatosnomenclador'] . "_"
                        . $desgloseexistente['uridatosnomenclador'];
                $i++;
            }
        }
        return $data;
    }

    private function existeDesgloseEntidadOrd2(
    $identidad, $idespecialidad, $iddesglosetiponomenclador, $arrayUrisHijas = array()
    ) {
        $strWhereIn = "";
        if ($arrayUrisHijas[0] != null) {
            $strWhereIn = " Where de.uridatosnomenclador IN('" . implode(
                            "','", $arrayUrisHijas
                    ) . "')";
        }
        $arrayUrisHijas = implode(",", $arrayUrisHijas);
        $conn = Doctrine_Manager:: connection();
        $_sql = " SELECT de.iddesgloseentidad as iddesgloseent
                   FROM  dat_desgloseentidad de
                   INNER JOIN dat_actividadentidad ae
                   ON( de.idactividadentidad = ae.idactividadentidad AND ae.identidad = ?
                   AND de.iddesglosetiponomenclador = ? )
                   INNER JOIN  dat_actespcomportamiento aec
                   ON(ae.idactespcomportamiento = aec.idactespcomportamiento AND aec.idespecialidad = ? )
                   $strWhereIn 
                   OFFSET 0 LIMIT 1 ";
        $result = $conn->execute(
                        $_sql, array($identidad, $iddesglosetiponomenclador, $idespecialidad)
                )->fetchAll();
        return $result[0]['iddesgloseent'] != null;
    }

    private function listarDesglosesExistentesParaArbol(
    $identidad, $idespecialidad, $iddesglosetiponomenclador, $strUrisHijas, $solouno = false
    ) {


        $conn = Doctrine_Manager:: connection();
        $query = " SELECT DISTINCT de.uridatosnomenclador,
                                   de.iddatosnomenclador,
                                   dn.denominacion
        FROM mod_planificacion.dat_desgloseentidad de
        INNER JOIN mod_planificacion.dat_actividadentidad ae
        ON(de.idactividadentidad = ae.idactividadentidad        
        AND ae.identidad = ?        
        " . (($strUrisHijas != "") ? " AND de.uridatosnomenclador IN ($strUrisHijas) " : " AND de.iddesgloseentidad = de.idpadre ") . "
         )
        INNER JOIN mod_planificacion.nom_datosnomenclador dn
        ON(dn.iddatosnomenclador = de.iddatosnomenclador)
        INNER JOIN  dat_actespcomportamiento aed
        ON(ae.idactespcomportamiento = aed.idactespcomportamiento AND aed.idespecialidad = ?)
        INNER JOIN nom_actividad a
        ON(aed.idactividad = a.idactividad)
        WHERE de.iddesglosetiponomenclador = ? 
        ";
        $arrayParametros = array($identidad, $idespecialidad,
            $iddesglosetiponomenclador);


        $res = $conn->execute($query, $arrayParametros);

        $result = $res->fetchAll();
        if ($solouno == true) {
            return ($result[0] != null) ? true : false;
        } else {
            return $result;
        }
    }

}

//fin clase
