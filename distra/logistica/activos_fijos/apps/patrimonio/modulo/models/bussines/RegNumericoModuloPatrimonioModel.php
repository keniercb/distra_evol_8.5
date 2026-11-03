<?php

/**
 * Clase que implementa todos los métodos relacionados con el comportamiento de un registro numérico como un módulo
 *
 * @autor Jorge Luis Cuellar Mondeja
 */
class RegNumericoModuloPatrimonioModel extends BaseModel
{
    private $mRegNumModTraza, $mProdModLogico;

    public function __construct()
    {
        parent::__construct();

        if (!class_exists('DatRegnumericoActivo')) {
            throw new ZendExt_Exepction('LOG_AFT_RN_004');
        }

        $this->mRegNumModTraza = new RegNumericoModuloTrazaPatrimonioModel();
        $this->mProdModLogico = new ProdModuloLogicoPatrimonioModel();
    }

    /**
     *
     */
    private function crearModuloDragDropSavedDestino($idRegNumericoDestino)
    {
        $datRegNumericoActivo = 'DatRegnumericoActivo';
        if ($idRegNumericoDestino) {
            $rnDestino = Doctrine::getTable('DatRegnumerico')->find($idRegNumericoDestino);
            $rnDestino->$datRegNumericoActivo->esmodulo = 2;
            $rnDestino->$datRegNumericoActivo->asignado = 2;
            $rnDestino->save();
            return $rnDestino;
        }
    }

    /**
     *  Para cuando se trata de poner un padre dentro de un hijo
     */
    private function crearModuloDragDropAux($objOrigen, $rnDestino)
    {
        $datRegNumericoActivo = 'DatRegnumericoActivo';
        if ($objOrigen->ordenizq < $rnDestino->$datRegNumericoActivo->ordenizq && $rnDestino->$datRegNumericoActivo
                ->ordender < $objOrigen->ordender
        ) {
            $rnDestino->$datRegNumericoActivo->idpadre = $rnDestino->idregnumerico;
            $rnDestino->save();
        }
    }

    public function getHijosModulo($izq, $der)
    {
        $query = new Doctrine_Query();

        $query->select(
            'rn.idregnumerico, prod.idproducto as idproducto, prod.idindicador as idprod,'
            . ' i.idtabla as idtabla,i.arridtablas as arridtablas'
        )
            ->from('DatRegnumerico rn')
            ->innerJoin('rn.DatRegnumericoActivo rna')
            ->innerJoin('rn.DatProductoLogistica prod')
            ->innerJoin('prod.NomIndicador i')
            ->where("rna.ordenizq >= ? AND rna.ordender <= ?", array($izq, $der));

        return $query->fetchArray();
    }

    public function asignarHijosModulo($regPadre, $arrRegHijos, $plantilla)
    {
        $collRegNumActivo = new Doctrine_Collection('DatRegnumericoActivo');
        $cDatRegnumericoActivo = 'DatRegnumericoActivo';
        $cDatPlantilla = 'DatPlantilla';

        for ($i = 0; $i < count($arrRegHijos); $i++) {
            if ($plantilla == true) {
                $arrIdesRegNumericosNumerico = $arrRegHijos[$i];
                $idPadreRegNumerico = $regPadre->idregnumerico;
                $denominacionPlantilla = $regPadre->$cDatRegnumericoActivo->$cDatPlantilla->denominacion;

                $conn = Zend_Registry::get('conexion');
                $conn->fetchAll(
                    "SELECT * FROM \"mod_logactivofijotangible\".\"f_duplicaarbol\"" .
                    "($arrIdesRegNumericosNumerico, 1, '$denominacionPlantilla', $idPadreRegNumerico)"
                );
            } else {

                $regNumerico = Doctrine::getTable('DatRegnumericoActivo')->find($arrRegHijos[$i]);
                $regNumerico->idpadre = $regPadre->idregnumerico;
                $regNumerico->asignado = 2;

                $collRegNumActivo->add($regNumerico);
            }
        }

        $collRegNumActivo->save();
        $regPadre->$cDatRegnumericoActivo->esmodulo = 2;
        $regPadre->$cDatRegnumericoActivo->asignado = 2;
        $regPadre->save();
    }

    public function actualizarHijosModulo($arrIdesRegNumericosNumericos)
    {
        $query = Doctrine_Query::create();

        $query->update('DatRegnumericoActivo reg')
            ->set('reg.idpadre', 'reg.idregnumerico')
            ->whereIn('reg.idregnumerico', $arrIdesRegNumericosNumericos)
            ->execute();
    }

    public function getSonModulos($arrIdesRegNumericosNumericos, $idAreaResp, $id)
    {
        $mRegNumActivo = new RegNumericoActivoModel();
        $parametros['idestructuraop'] = $idAreaResp;
        $parametros['modulo'] = 1;

        if (!$id) {
            $parametros['asignado'] = 2;
        }

        $datos = $mRegNumActivo->getMediosDisponibles($parametros);
        return $this->getBuscarPadres($datos['datos'], $arrIdesRegNumericosNumericos);
    }

    public function deleteHijosModulo($ordenIzq, $ordenDer)
    {
        $mRegNumActivo = new RegNumericoActivoModel();

        $query = $mRegNumActivo->getQueryRegNumerico('rn');
        $query->delete()
            ->where(
                "rn.idregnumerico IN (SELECT rna.idregnumerico FROM DatRegnumericoActivo rna
                WHERE rna.ordenizq >= $ordenIzq AND rna.ordender <= $ordenDer)"
            )->execute();
    }

    public function getBuscarPadres($arrRegNumericos, $arrIdesRegNumericosNumericos)
    {
        foreach ($arrRegNumericos as $value) {
            if ($value['idregnumerico'] == $arrIdesRegNumericosNumericos) {
                if ($value['idpadremodulo'] != $value['idregnumerico']) {
                    return self::getBuscarPadres($arrRegNumericos, $value['idpadremodulo']);
                }

                array_push($arrIdesRegNumericos, $value['idregnumerico']);
            }
        }
        return $arrIdesRegNumericos;
    }

    /**
     * Adicionar módulos
     */
    public function adicionarModulo($parametros)
    {

        $conn = Zend_Registry::get('conexion');
        $conn->fetchAll("select * from \"mod_logactivofijotangible\".\"f_ordena\"()");
        if ($parametros->idmodulo != 0) {

            $moduloPadre = Doctrine::getTable('DatRegnumericoActivo')->find($parametros->idmodulo);
            $edificio = self::esEdificio($parametros->idmodulo);
            if (count($parametros->medios) > 1) {
                $areavarios = $parametros->idarea;
                $modulo = $parametros->idmodulo;
                $colleObj = new Doctrine_Collection('DatRegnumericoActivo');
                foreach ($parametros->medios as $key => $value) {

                    $datregnumactivo = Doctrine::getTable('DatRegnumericoActivo')->find($value->idregnumerico);
                    $datregnumactivo->asignado = 2;
                    $datregnumactivo->idpadre = $modulo;
                    if ($edificio) {
                        $datregnumactivo->esmodulo = 2;
                        $objetoExpi = new DatExpedienteInmueble();
                        $objetoExpi->idexpinmueble = $value->idregnumerico;
                        $objetoExpi->save();
                    }
                    $datregnumactivo->idarearesp = $areavarios;
                    $colleObj->add($datregnumactivo);
                }
                $moduloPadre->esmodulo = 2;
                $moduloPadre->save();
                $colleObj->save();
            } else {

                $datregnumactivo = Doctrine::getTable('DatRegnumericoActivo')->find(
                    $parametros->medios[0]->idregnumerico
                );
                $datregnumactivo->asignado = 2;
                $datregnumactivo->idpadre = $parametros->idmodulo;
                $datregnumactivo->idarearesp = $parametros->idarea;
                if ($edificio) {
                    $datregnumactivo->esmodulo = 2;
                    $objetoExpi = new DatExpedienteInmueble();
                    $objetoExpi->idexpinmueble = $parametros->medios[0]->idregnumerico;
                    $objetoExpi->save();
                }
                $moduloPadre->esmodulo = 2;
                $moduloPadre->save();
                $datregnumactivo->save();
            }
            $this->mRegNumModTraza->guardarTrazaAdicionar($parametros);
        } else {
            if (count($parametros->medios) > 1) {
                $area = $parametros->idarea;
                $colleObj = new Doctrine_Collection('DatRegnumericoActivo');

                foreach ($parametros->medios as $key => $value) {
                    $objetoExpi = new DatExpedienteInmueble();
                    $objetoExpi->idexpinmueble = $value->idregnumerico;
                    $objetoExpi->save();

                    $datregnumactivo = Doctrine::getTable('DatRegnumericoActivo')->find($value->idregnumerico);
                    $datregnumactivo->asignado = 2;
                    $datregnumactivo->esmodulo = 2;
                    $datregnumactivo->idarearesp = $area;
                    $datregnumactivo->idpadre = $value->idregnumerico;
                    $colleObj->add($datregnumactivo);
                }

                $colleObj->save();
            } else {
                $objetoExpi = new DatExpedienteInmueble();
                $objetoExpi->idexpinmueble = $parametros->medios[0]->idregnumerico;
                $objetoExpi->save();

                $datregnumactivo = Doctrine::getTable('DatRegnumericoActivo')->find(
                    $parametros->medios[0]->idregnumerico
                );
                $datregnumactivo->asignado = 2;
                $datregnumactivo->esmodulo = 2;
                $datregnumactivo->idarearesp = $parametros->idarea;
                $datregnumactivo->idpadre = $parametros->medios[0]->idregnumerico;
                $datregnumactivo->save();
            }
        }
        $conn->fetchAll("select * from \"mod_logactivofijotangible\".\"f_ordena\"()");

        /*  $mRegNumActivo = new RegNumericoActivoModel();
          $mRegNumActivo->ordenarArbolModulosRegNumericos();

          if ($parametros->idmodulo != 0) {
          $moduloPadre = Doctrine::getTable('DatRegnumericoActivo')->find($parametros->idmodulo);
          $edificio = self::esEdificio($parametros->idmodulo);
          if (count($parametros->medios) > 1) {
          $idAreaResp = $parametros->idarea;
          $modulo = $parametros->idmodulo;

          $colleObj = new Doctrine_Collection('DatRegnumericoActivo');

          foreach ($parametros->medios as $key => $value) {

          $regNumActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value->idregnumerico);
          $regNumActivo->asignado = 2;
          $regNumActivo->idpadre = $modulo;
          if ($edificio) {
          $datregnumactivo->esmodulo = 2;
          $objetoExpi = new DatExpedienteInmueble();
          $objetoExpi->idexpinmueble = $value->idregnumerico;
          $objetoExpi->save();
          }
          $regNumActivo->idarearesp = $idAreaResp;
          $colleObj->add($regNumActivo);
          }
          $moduloPadre->esmodulo = 2;
          $moduloPadre->save();
          $colleObj->save();
          } else {

          $regNumActivo = Doctrine::getTable('DatRegnumericoActivo')
          ->find($parametros->medios[0]->idregnumerico);

          $regNumActivo->asignado = 2;
          $regNumActivo->idpadre = $parametros->idmodulo;
          $regNumActivo->idarearesp = $parametros->idarea;
          if ($edificio) {
          $datregnumactivo->esmodulo = 2;
          $objetoExpi = new DatExpedienteInmueble();
          $objetoExpi->idexpinmueble = $parametros->medios[0]->idregnumerico;
          $objetoExpi->save();
          }
          $moduloPadre->esmodulo = 2;
          $moduloPadre->save();
          $regNumActivo->save();
          }
          $this->mRegNumModTraza->guardarTrazaAdicionar($parametros);
          } else {
          if (count($parametros->medios) > 1) {

          $area = $parametros->idarea;
          $colleObj = new Doctrine_Collection('DatRegnumericoActivo');
          foreach ($parametros->medios as $key => $value) {
          $objetoExpi = new DatExpedienteInmueble();
          $objetoExpi->idexpinmueble = $value->idregnumerico;
          $objetoExpi->save();
          $regNumActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value->idregnumerico);
          $regNumActivo->asignado = 2;
          $regNumActivo->esmodulo = 1;
          $regNumActivo->idarearesp = $area;
          $regNumActivo->idpadre = $value->idregnumerico;
          $regNumActivo->save();
          $colleObj->add($regNumActivo);
          }
          $colleObj->save();
          } else {
          $objetoExpi = new DatExpedienteInmueble();
          $objetoExpi->idexpinmueble = $parametros->medios[0]->idregnumerico;
          $objetoExpi->save();
          $regNumActivo = Doctrine::getTable('DatRegnumericoActivo')
          ->find($parametros->medios[0]->idregnumerico);
          $regNumActivo->asignado = 2;
          $regNumActivo->idarearesp = $parametros->idarea;
          $regNumActivo->idpadre = $parametros->medios[0]->idregnumerico;
          $regNumActivo->save();
          }
          }

          $mRegNumActivo->ordenarArbolModulosRegNumericos(); */
    }

    /**
     * Eliminar módulos
     */
    public function eliminarModulos($parametros)
    {
        $conn = Zend_Registry::get('conexion');
        if (count($parametros) == 1) {
            $this->mRegNumModTraza->guardarTrazaEliminar($parametros);
            if ($parametros[0]->esmodulo == 2) { //eliminar
                $padreordenizq = $parametros[0]->ordenizq;
                $padreordender = $parametros[0]->ordender;
                $sql = "update mod_logactivofijotangible.dat_regnumericoactivo
                    SET idpadre = idregnumerico,
                   
                    asignado = 1,
                    esmodulo = 1
                    where ordenizq > $padreordenizq and ordender < $padreordender";
                $conn->fetchAll($sql);
                $query = new Doctrine_Query();
                $query->delete()
                    ->from('DatExpedienteInmueble dexp')
                    ->where('dexp.idexpinmueble = ?', array($parametros[0]->idregnumerico))
                    ->execute();
            }
            $modulo = Doctrine::getTable('DatRegnumericoActivo')->find($parametros[0]->idregnumerico);
            $idPadreModulo = $modulo->idpadre;
            $modulo->esmodulo = 1;
            $modulo->asignado = 1;
            $modulo->idpadre = $modulo->idregnumerico;
            $modulo->save();

            $registro = Doctrine::getTable('DatRegistroespecialidad')->find($parametros[0]->idregnumerico);
            if ($registro) {
                $registro->delete();
            }
            // $incripcion = Doctrine::getTable('DatInscripcionInmueble')->find($parametros[0]->idregnumerico);
            $incripcion = Doctrine::getTable('DatInscripcionInmueble')->findBy(
                'idregnunericoactivo', $parametros[0]->idregnumerico
            );
            if ($incripcion) {
                $incripcion->delete();
            }
            $conn->fetchAll("select * from \"mod_logactivofijotangible\".\"f_ordena\"()");
            if ($idPadreModulo != $modulo->idregnumerico) {
                $moduloPadre = Doctrine::getTable('DatRegnumericoActivo')->find($idPadreModulo);
                if ($moduloPadre->ordender - $moduloPadre->ordenizq == 1) {
                    $moduloPadre->esmodulo = 2;
                    $moduloPadre->save();
                }
            }
        } else {
            $this->mRegNumModTraza->guardarTrazaEliminar($parametros);
            for ($i = 0; $i < count($parametros); $i++) {
                if ($parametros[$i]->esmodulo == 2) {
                    $padreordenizq = $parametros[$i]->ordenizq;
                    $padreordender = $parametros[$i]->ordender;
                    $sql = "update mod_logactivofijotangible.dat_regnumericoactivo
                    SET idpadre = idregnumerico,
                    asignado = 1,
                    esmodulo = 1
                    where ordenizq > $padreordenizq and ordender < $padreordender";
                    $conn->fetchAll($sql);
                    $query = new Doctrine_Query();
                    $query->delete()
                        ->from('DatExpedienteInmueble dexp')
                        ->where('dexp.idexpinmueble = ?', array($parametros[$i]->idregnumerico))
                        ->execute();
                }
                $modulo = Doctrine::getTable('DatRegnumericoActivo')->find($parametros[$i]->idregnumerico);
                $idPadreModulo = $modulo->idpadre;
                $modulo->esmodulo = 1;
                $modulo->asignado = 1;
                $modulo->idpadre = $modulo->idregnumerico;
                $modulo->save();
                $registro = Doctrine::getTable('DatRegistroespecialidad')->find($parametros[$i]->idregnumerico);
                if ($registro) {
                    $registro->delete();
                }
                // $incripcion = Doctrine::getTable('DatInscripcionInmueble')->find($parametros[$i]->idregnumerico);
                $incripcion = Doctrine::getTable('DatInscripcionInmueble')->findBy(
                    'idregnunericoactivo', $parametros[$i]->idregnumerico
                );
                if ($incripcion) {
                    $incripcion->delete();
                }
                $conn->fetchAll("select * from \"mod_logactivofijotangible\".\"f_ordena\"()");
                if ($idPadreModulo != $modulo->idregnumerico) {
                    $moduloPadre = Doctrine::getTable('DatRegnumericoActivo')->find($idPadreModulo);
                    if ($moduloPadre->ordender - $moduloPadre->ordenizq == 1) {
                        $moduloPadre->esmodulo = 2;
                        $moduloPadre->save();
                    }
                }
            }
        }

        /*  $mRegNumActivo = new RegNumericoActivoModel();
          $this->mRegNumModTraza->guardarTrazaEliminar($parametros);

          for ($i = 0; $i < count($parametros); $i++) {
          if ($parametros[$i]->esmodulo == 2) {
          $padreordenizq = $parametros[$i]->ordenizq;
          $padreordender = $parametros[$i]->ordender;

          Doctrine_Query::create()
          ->update('DatRegNumericoActivo')
          ->set('idpadre', 'idregnumerico')
          ->set('asignado', 1)
          ->set('esmodulo', 1)
          ->where('ordenizq > ? AND ordender < ?', array($padreordenizq, $padreordender))
          ->execute();
          }

          $modulo = Doctrine::getTable('DatRegnumericoActivo')->find($parametros[$i]->idregnumerico);
          $idPadreModulo = $modulo->idpadre;

          $modulo->esmodulo = 1;
          $modulo->asignado = 1;
          $modulo->idpadre = $modulo->idregnumerico;
          $modulo->save();

          $mRegNumActivo->ordenarArbolModulosRegNumericos();

          if ($idPadreModulo != $modulo->idregnumerico) {
          $moduloPadre = Doctrine::getTable('DatRegnumericoActivo')->find($idPadreModulo);
          if ($moduloPadre->ordender - $moduloPadre->ordenizq == 1) {
          $moduloPadre->esmodulo = 1;
          $moduloPadre->save();
          }
          }
          } */
    }

    public function getDenominacionRegistro($resgistro)
    {
        $denominacion = '';
        if ($resgistro == 'constAloj') {
            $denominacion = 'Campamento';
        }
        if ($resgistro == 'sistemaEmp') {
            $denominacion = 'Sistema empresarial';
        }
        if ($resgistro == 'ingenieria') {
            $denominacion = 'Ingeniería';
        }
        if ($resgistro == 'vivienda') {
            $denominacion = 'Vivienda';
        }
        return $denominacion;
    }

    /**
     * Obtener listado de módulos
     */
    public function obtenerModulos($parametros)
    {
        new DatProductoModulo();
        $sRegNumActivo = new RegNumActivoService(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);

        $queryMedios = $sRegNumActivo->getMediosDisponibles($parametros, true);
        $queryMedios->leftJoin('drna.DatRegistroespecialidad reg');
        $queryMedios->addSelect("reg.denominacion as registro");
        $total = $queryMedios->count();

        if ($parametros['limit']) {
            $queryMedios->offset($parametros['start']);
            $queryMedios->limit($parametros['limit']);
        }

        $datos['datos'] = $queryMedios->fetchArray();
        $datos['total'] = $total;
        $datos['cantidad'] = $total;
        foreach ($datos['datos'] as $index => &$value) {
            if ($value['registro']) {
                $datos['datos'][$index]['denomRegistro'] = $this->getDenominacionRegistro($value['registro']);
            }
            $sDatIdentificacionInmuebleCamp = Doctrine::getTable('DatIdentificacionInmuebleCamp')
                ->find($value['idregnumerico']);
            if ($sDatIdentificacionInmuebleCamp) {
                $datidentInmCamp = $sDatIdentificacionInmuebleCamp->toArray();
                if ($datidentInmCamp && $datidentInmCamp['fechaexplotacion']) {
                    $fechaexplotacion = $datidentInmCamp['fechaexplotacion'];
                    $arrayfecha = split("/", $fechaexplotacion);
                    $anno = $arrayfecha[2] + $value['vidautil'];
                    $fecha = $arrayfecha[0] . "/" . $arrayfecha[1] . "/" . $anno;
                    $datos['datos'][$index]['vidautilfecha'] = $fecha;
                }
            }

            $idespe = $this->IdespecialidadRegimen($value['idespecialidad']);

            $query = new Doctrine_Query();
            $query->addSelect('ins.idregnunericoactivo');
            $query->from('DatInscripcionInmueble ins');
            $query->addWhere("ins.idregnunericoactivo = '{$value['idregnumerico']}'");
            $result = $query->fetchArray();

            $datos['datos'][$index]['denominacioncolumnareporte'] = $idespe['denominacioncolumnareporte'];
            $datos['datos'][$index]['inscrito'] = (count($result) > 0) ? 1 : 0;
            $value['_id'] = $value['idregnumerico'];
            $value['_is_leaf'] = ($value['esmodulo'] == 1) ? true : false;
            $value['_parent'] = ($value['idpadremodulo'] == $value['idregnumerico']) ? null : $value['idpadremodulo'];
            $value['denominacion'] = ($value['denominacionPModulo']) ?
                $value['denominacionPModulo'] : $value['denominacionIndicador'];
            $value['denominacion'] = ($value['denominacion'] == null) ?
                $value['DatProductoModulo']['denominacion'] : $value['denominacion'];

            $arrayDenomTipoCom = $this->getObrasProtectorasInmTipoComunicacion($value['idregnumerico']);
            $datos['datos'][$index]['denomTipoCom'] = "";
            foreach ($arrayDenomTipoCom as $pos => $tipocom) {

                ($pos < (count($arrayDenomTipoCom) - 1)) ?
                    $datos['datos'][$index]['denomTipoCom'] .= $tipocom['denominacion'] . ", " :
                    $datos['datos'][$index]['denomTipoCom'] .= $tipocom['denominacion'];
            }
            if ($value['esmodulo'] == 2) {
                /* $totalvalorcontable = $this->getContorValorInmueble($value['ordendermodulo'], $value['ordenizqmodulo'],
                  $value['idarearesp']); */
                $datos['datos'][$index]['valorcontable'] = $datos['datos'][$index]['valormodulo'];
                $datos['datos'][$index]['valorcontablealternativo'] = $datos['datos'][$index]['valormoduloalternativo'];
            }

            $querysaberpadre = new Doctrine_Query();
            $querysaberpadre->select('drna.idregnumerico');
            $querysaberpadre->from('DatRegnumericoActivo drna');
            $querysaberpadre->where("drna.idregnumerico <> '{$value['idregnumerico']}'");
            $querysaberpadre->addWhere("drna.idpadre = '{$value['idregnumerico']}'");
            $resultsaberpadre = $querysaberpadre->fetchArray();
            if (count($resultsaberpadre) > 0) {
                $datos['datos'][$index]['espadre'] = true;
            } else {
                $datos['datos'][$index]['espadre'] = false;
            }
        }
       // print_r($datos['datos']);die;

        return $datos;
    }

    public function getObrasProtectorasInmTipoComunicacion($idregnumerico)
    {
        $querycom = new Doctrine_Query();
        $querycom->select('tc.*, ntc.idcomunicacion as idcomunicacion,
        ntc.denominacion as denominacion, ntc.estado as estado');
        $querycom->from('DatObrasProtectorasInmTipoComunicacion tc')
            ->leftJoin('tc.NomTipoComunicacion ntc');
        if ($idregnumerico) {
            $querycom->addWhere("tc.idobrasing = ?", $idregnumerico);
        }
        return $querycom->fetchArray();
    }

    /**
     *
     */
    public function crearModuloDragDrop($arrIdesOrigen, $idRegNumericoDestino)
    {
        $mRegNumActivo = new RegNumericoActivoModel();
        $rnDestino = $this->crearModuloDragDropSavedDestino($idRegNumericoDestino);
        foreach ($arrIdesOrigen as $idOrigen) {

            // Si existe destino se le pongo el id padre del destino, sino pongo su mismo idpadre.
            $objOrigen = Doctrine::getTable('DatRegnumericoActivo')->find($idOrigen);
            $objPadre = Doctrine::getTable('DatRegnumericoActivo')->find($objOrigen->idpadre);
            $objOrigen->idpadre = ($idRegNumericoDestino) ? $rnDestino->idregnumerico : $idOrigen;
            $objOrigen->save();

            // Para cuando se trata de poner un padre dentro de un hijo
            $this->crearModuloDragDropAux($objOrigen, $rnDestino);
            $hijosOrigen = Doctrine::getTable('DatRegnumericoActivo')
                ->findByDql("idpadre = $objOrigen->idregnumerico and idregnumerico <> $objOrigen->idregnumerico");
            $condicion = (!$hijosOrigen || count($hijosOrigen) == 0) ? 1 : 2;
            $objOrigen->esmodulo = $condicion;
            $objOrigen->asignado = ($objOrigen->idregnumerico == $objOrigen->idpadre &&
                (!$hijosOrigen || count($hijosOrigen) == 0)) ? 1 : 2;
            $objOrigen->esmodulo = $condicion;

            $objOrigen->save();

            //  Padres
            $hijosPadres = Doctrine::getTable('DatRegnumericoActivo')
                ->findByDql("idpadre = $objPadre->idregnumerico and idregnumerico <> $objPadre->idregnumerico");
            $objPadre->esmodulo = (!$hijosPadres || count($hijosPadres) == 0) ? 1 : 2;
            $objPadre->save();
        }

        $mRegNumActivo->initReNumActivoModel();
        $mRegNumActivo->ordenarArbolModulosRegNumericos();
        return true;
    }

    /**
     * Busca los números de inventarios que se repiten.
     */
    public function getBuscarNroInvRepetidos($arrNrosInventario, $idAreaResp)
    {
        $query = Doctrine_Query::create();
        $query->from('DatRegnumericoActivo rna');
        $query->where("rna.idarearesp = ?", $idAreaResp);
        $query->whereIn("rna.nroinventario", $arrNrosInventario);

        return $query->count();
    }

    /**
     * Eliminar las nomenlcaturas de módulo que tienen  números de inventario
     */
    public function eliminarModuloAsociadoNroinventario($parametros)
    {
        if (count($parametros)) {
            $arrIdesRegNumericos = array();

            for ($i = 0; $i < count($parametros); $i++) {
                $arrIdesRegNumericos[] = $parametros[$i]->idregnumerico;
            }
            Doctrine_Query::create()->delete()
                ->from('DatRegnumerico')
                ->whereIn('idregnumerico', $arrIdesRegNumericos)
                ->execute();
        }
    }

    /**
     * Asociar una nomenclatura de módulo con un número de inventario
     */
    public function asociarNomenclaturaNroInventario($parametros, $idAreaResp)
    {
        $cProductoModulo = 'DatProductoModulo';
        if ($parametros[2]) {
            $objDarRegNum = Doctrine::getTable('DatRegnumerico')->find($parametros[2]);
            $objDregNumActivo = Doctrine::getTable('DatRegnumericoActivo')->find($objDarRegNum->idregnumerico);
        } else {
            $objDarRegNum = new DatRegnumerico();
            $objDregNumActivo = new DatRegnumericoActivo();
        }

        if (is_string($parametros[0])) {

            $exis = $this->mProdModLogico->existeModuloLogico($parametros[0], $idAreaResp);
            if ($exis >= 1) {
                $producto = Doctrine::getTable('DatProductoModulo')->findBy('denominacion', $parametros[0]);
                $objDarRegNum->idproducto = $producto[0]->idproducto;
            } else {
                new DatProductoModulo();
                $producto = new DatProductoLogistica();

                $producto->$cProductoModulo->denominacion = $parametros[0];
                $producto->idestructura = $idAreaResp;

                $producto->save();
                $objDarRegNum->idproducto = $producto->idproducto;
            }
        } else {
            $objDarRegNum->idproducto = $parametros[0];
        }
        $objDarRegNum->save();

        $objDregNumActivo->idregnumerico = $objDarRegNum->idregnumerico;
        $objDregNumActivo->nroinventario = $parametros[1];
        $objDregNumActivo->idarearesp = $idAreaResp;
        $objDregNumActivo->estaentidad = 1;
        $objDregNumActivo->save();

        return 1;
    }

    /**
     * Obtener los datos de un módulo con sus hijos
     */
    public function getDatosHijosModulo($parametros)
    {

        new DatProductoModulo();
        $sRegNumActivo = new RegNumActivoService(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
        $datos = $sRegNumActivo->getMediosDisponibles($parametros);
        foreach ($datos['datos'] as &$value) {
            $value['imagenes'] = self::getIdImagenIndicador($value['idindicador']);

            if (!$value['idindicador']) {
                $value['text'] = $value['denominacion'];
            }
        }

        return $datos;
    }

    /**
     *  Obtener arreglo de identificadores de las imagenes asociadas a un indicador
     */
    public function getIdImagenIndicador($idIndicador)
    {
        $resultado = array();
        if ($idIndicador) {
            $conn = Zend_Registry::get('conexion');
            $resultado = $conn->execute(
                "SELECT idimagen FROM mod_datosmaestros.dat_imagenindicador "
                . "WHERE idindicador = $idIndicador"
            )->fetchAll(PDO::FETCH_COLUMN);
        }

        return $resultado;
    }

    public function esEdificio($idregnumerico)
    {
        $query = new Doctrine_Query();
        $query->from('DatExpedienteInmueble expi')->innerJoin('expi.NomRegimenPatrimonio r');
        $query->addWhere("r.idregimen = ? and expi.idexpinmueble = ?", array(1, $idregnumerico));
        $cantidad = $query->count();

        if ($cantidad > 0)
            return true;
        else
            return false;
    }

    public function getContorValorInmueble($ordendermodulo, $ordenizqmodulo, $idarea)
    {
        $query = Doctrine_Query::create();
        $query->from('DatRegnumericoActivo rna');
        $query->select('sum(rna.valorcontable) as valorcontable');
        $query->where("rna.idarearesp = ?", $idarea);
        $query->addWhere("rna.ordenizq >= $ordenizqmodulo");
        $query->addWhere("rna.ordender <= $ordendermodulo");
        $valorcontable = $query->fetchArray();
        return $valorcontable;
    }

    public function getCargarRegimen($parametros/* $idregnumerico, $accion, $identificacion, $idestructura */)
    {

        $query = new Doctrine_Query();
        $query->from('DatExpedienteInmueble expi');
        $query->addSelect('expi.idexpinmueble, expi.idregimen ');
        $query->addWhere("expi.idexpinmueble = ?", array($parametros['idregnumerico']));
        $idexpinmueble = $query->fetchArray();
        $conn = Zend_Registry::get('conexion');

        if ($parametros['identificacion'] == "true") {
            $queryIdent = new Doctrine_Query();
            $queryIdent->from('NomRegimenPatrimonio m');
            $queryIdent->innerJoin('m.DatRegimenPatrimonioEntidad regimen');
            $queryIdent->select('m.idregimen, m.denominacion');
            $queryIdent->addWhere("regimen.idestructuracomun  = ?", array($parametros['idestructura']));
            $result = $queryIdent->fetchArray();
            $conn = Zend_Registry::get('conexion');
            /* $sql = "SELECT m.idregimen , m.denominacion
              FROM mod_logactivofijotangible.nom_regimen m
              inner JOIN mod_logactivofijotangible.dat_regimenentidad regimen on m.idregimen = regimen.idregimen
              WHERE regimen.idestructuracomun = '{$parametros['idestructura']}' ";
              $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC); */
            return $result;
        } else {
            if (
                count($idexpinmueble) == 1 && $idexpinmueble[0]['idregimen'] != null &&
                $parametros['cargartodo'] != "cargartodo"
            ) {
                $queryExp = new Doctrine_Query();
                $queryExp->from('NomRegimenPatrimonio m');
                $queryExp->select('m.*');
                $queryExp->addWhere("m.idregimen  = ?", array($idexpinmueble[0]['idregimen']));
                $regimen = $queryExp->fetchArray();
                /* $sql = "SELECT re.*
                  FROM mod_logactivofijotangible.nom_regimen re
                  where re.idregimen = {$idexpinmueble[0]['idregimen']}";
                  $regimen = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC); */

                return $regimen;
            } else {

                $queryTodo = new Doctrine_Query();
                $queryTodo->from('NomRegimenPatrimonio m');
                $queryTodo->innerJoin('m.DatRegimenPatrimonioEntidad regimen');
                $queryTodo->select('m.*');
                $regimen = $queryTodo->fetchArray();
                /*  $sql = "SELECT idregimen, denominacion
                  FROM mod_logactivofijotangible.nom_regimen";
                  $regimen = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC); */
                return $regimen;
            }
        }
    }

    public function getDocexpedienteNorte($parametros)
    {
        $query = new Doctrine_Query();
        //$query->from('NomDocumentoExpediente net');
        $query->from('DatDocumentoExpedienteEntidad net')->innerJoin('net.NomDocumentoExpediente ndex');
        $query->addSelect('ndex.denominacion as denominacion,ndex.culminacion as culminacion,'
            . 'net.idexpediente,net.idestructuracomun, ndex.idtabla as idtabla');

        $query->addWhere("net.idestructuracomun = {$parametros['idestructuracomun']}");
        if ($parametros['idexpedienteactivo']) {
            $query->whereNotIn('net.idexpediente', $parametros['idexpedienteactivo']);
        }

        $query->limit(($parametros['limit']) ? $parametros['limit'] : 20)
            ->offset(($parametros['start']) ? $parametros['start'] : 0)
            ->orderBy('net.idexpediente DESC');

        return array(
            'total' => $query->count(), 'datos' => $query->limit(($parametros['limit']) ? $parametros['limit'] : 20)
                ->offset(($parametros['start']) ? $parametros['start'] : 0)
                ->orderBy('net.idexpediente DESC')->fetchArray()
        );
    }

    public function getExpedienteInmueble($idexpinmueble, $parametros)
    {
        $query = new Doctrine_Query();
        $query->from('DatDocExpediente net');
        $query->innerJoin("net.NomDocumentoExpediente expactv");
        if ($idexpinmueble) {
            $query->where('net.idexpinmuelble = ?', array($idexpinmueble));
        }


        $query->addSelect(
            'net.*, expactv.denominacion as denominacion, expactv.culminacion as culminacion, '
            . 'expactv.idtabla as idtabla'
        );

        $query->limit(($parametros['limit']) ? $parametros['limit'] : 20)
            ->offset(($parametros['start']) ? $parametros['start'] : 0)
            ->orderBy('net.idexpinmuelble DESC');

        return array(
            'total' => $query->count(), 'datos' => $query->limit(($parametros['limit']) ? $parametros['limit'] : 20)
                ->offset(($parametros['start']) ? $parametros['start'] : 0)
                ->orderBy('net.idexpinmuelble DESC')->fetchArray()
        );
    }

    public function getAddDocExpedinte($parametros)
    {
        $query = new Doctrine_Query();
        $query->from('DatExpedienteInmueble expi');
        $query->addSelect('expi.idexpinmueble ');
        $query->addWhere("expi.idexpinmueble = ?", array($parametros['idregnumerico']));
        $idexpinmueble = $query->fetchArray();
        if (count($idexpinmueble) == 0) {
            $objetoExpi = new DatExpedienteInmueble();
            $objetoExpi->idexpinmueble = $parametros['idregnumerico'];
            $objetoExpi->save();

            foreach ($parametros['datidexpediente'] as $key => $value) {
                $objetoDocExpi = new DatDocExpediente();
                $objetoDocExpi->idexpinmuelble = $parametros['idregnumerico'];
                $objetoDocExpi->idexpediente = $value;
                $objetoDocExpi->save();
            }
        } else {
            foreach ($parametros['datidexpediente'] as $key => $value) {
                $objetoDocExpi = new DatDocExpediente();
                $objetoDocExpi->idexpinmuelble = $parametros['idregnumerico'];
                $objetoDocExpi->idexpediente = $value;
                $objetoDocExpi->save();
            }
        }
        return 1;
    }

    public function getEliminarDocExpedinte($parametros)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('DatDocExpediente docexp')
            ->where('docexp.idexpinmuelble = ?', array($parametros['idregnumerico']))
            ->whereIn('docexp.idexpediente', $parametros['datidexpediente'])
            ->execute();
        return 1;
    }

    public function getCargarProvincias($idpadre)
    {
        $obj = ServiciosConfiguracionGeneralHelper::__init();
        $result = $obj->cargarEstruturadpa('idpadre');
        return $result;
    }

    public function getCargarMunicipios($idpadre)
    {
        $obj = ServiciosConfiguracionGeneralHelper::__init();
        $result = $obj->cargarEstruturadpa($idpadre);
        return $result;
    }

    public function getCargarSeccion()
    {
        $query = new Doctrine_Query();
        $query->from('NomTipoSeccion secc');
        $query->innerJoin('secc.DatTipoSeccionEntidad secce');
        $query->select('secc.*');
        return $query->fetchArray();
    }

    public function getAddInscripcion($parametros)
    {
        $query = new Doctrine_Query();
        $query->from('DatInscripcionInmueble ins');
        $query->addWhere('ins.idregnunericoactivo = ?', array($parametros->idregnumerico));
        $query->addWhere('ins.modregimen = ?', array($parametros->modregimen));
        $query->addSelect('ins.*');
        $datos = $query->fetchArray();

		$fecha = $parametros->fechainscripcion;	
        if (count($datos) == 0) {
            $objetoExpi = new DatInscripcionInmueble();
            $objetoExpi->synchronizeWithArray($parametros);
            $objetoExpi->fechainscripcion = $fecha;
            $objetoExpi->idregnunericoactivo = $parametros->idregnumerico;
            $objetoExpi->modregimen = $parametros->modregimen;
            $objetoExpi->save();
        } else {
            $colleObj = new Doctrine_Collection('DatInscripcionInmueble');
            $datregnumactivo = Doctrine::getTable('DatInscripcionInmueble')->findByDql("idregnunericoactivo =?",
                array($parametros->idregnumerico));

            $datregnumactivo[0]['idseccion'] = $parametros->idseccion;
            $datregnumactivo[0]['tomo'] = $parametros->tomo;
            $datregnumactivo[0]['folio'] = $parametros->folio;
            $datregnumactivo[0]['finca'] = $parametros->finca;
            $datregnumactivo[0]['nroresolucion'] = $parametros->nroresolucion;
            $datregnumactivo[0]['iddptprovincia'] = $parametros->iddptprovincia;
            $datregnumactivo[0]['iddptmunicipio'] = $parametros->iddptmunicipio;
            $datregnumactivo[0]['fechainscripcion'] = $fecha;
            $datregnumactivo[0]['modregimen'] = $parametros->modregimen;
            $colleObj->add($datregnumactivo[0]);
            $colleObj->save();
        }
        return 1;
    }

    public function getCargarInscripcion($idregnumerico, $modregimen)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT ins.*, secc.denominacion, dpt.denominacion as provincia,
                    (
                    SELECT dpa.denominacion

                    FROM mod_datosmaestros.nom_pais p
                    left join mod_datosmaestros.nom_dpt dpa on dpa.idpais =  p.idpais
                    where dpa.iddpt <> dpa.idpadre and dpa.iddpt = (SELECT dins.iddptmunicipio
                    FROM mod_logpatrimonio.dat_inscripcioninmueble dins
                    where dins.idregnunericoactivo = $idregnumerico and dins.modregimen = $modregimen
                    )) as municipio

                    FROM mod_logpatrimonio.dat_inscripcioninmueble ins
                    left JOIN mod_logpatrimonio.nom_tiposeccion secc on ins.idseccion = secc.idseccion
                    left JOIN mod_datosmaestros.nom_dpt dpt on dpt.iddpt = ins.iddptprovincia
                    left JOIN mod_datosmaestros.nom_pais p on p.idpais = dpt.idpais
                    WHERE ins.idregnunericoactivo = $idregnumerico "
            . "and ins.modregimen = $modregimen";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($datos) == 0) {
            return 1;
        } else {
            return $datos[0];
        }
    }

    public function getConformarDocExpediente($parametros)
    {

        $query = new Doctrine_Query();
        $query->from('DatExpedienteInmueble expi');
        $query->addSelect('expi.idexpinmueble ');
        $query->addWhere("expi.idexpinmueble = ?", array($parametros['idregnumerico']));
        $idexpinmueble = $query->fetchArray();
        $global = ZendExt_GlobalConcept::getInstance();
        $fechacontable = $global->FechaContable->fecha;

        if (!$fechacontable || $fechacontable == "") {

            $fechacontable = $this->configuracionHelper->getFechaContableSubsistema(
                $parametros['identidad'], LogisticaGlobal::SUBSISTEMA_PATRIMONIO
            );
            /* $fechacontable = $this->integrator->parametros->FechaContableSubsistema($parametros['identidad'],
              LogisticaGlobal::SUBSISTEMA_AFT); */
        }
        if ($parametros['addfecha'] == 1) {
            $parametros['addfecha'] = $fechacontable;
        } else {
            $parametros['addfecha'] = null;
        }


        if (count($idexpinmueble) == 0) {
            $objetoExpi = new DatExpedienteInmueble();
            $objetoExpi->idexpinmueble = $parametros['idregnumerico'];
            $objetoExpi->idregimen = ($parametros['cmbregimen']) ? $parametros['cmbregimen'] : null;
            $objetoExpi->registrocontable = $parametros['regcontable'];
            $objetoExpi->areaatencion = $parametros['areaatencion'];
            $objetoExpi->fecha = $parametros['addfecha'];
            $objetoExpi->save();
        } else {
            $colleObj = new Doctrine_Collection('DatExpedienteInmueble');
            $datregnumactivo = Doctrine::getTable('DatExpedienteInmueble')->find($parametros['idregnumerico']);
            if ($parametros['cmbregimen'] != "" || $parametros['cmbregimen'] != null) {
                $datregnumactivo->idregimen = $parametros['cmbregimen'];
            }

            $datregnumactivo->registrocontable = $parametros['regcontable'];
            $datregnumactivo->areaatencion = $parametros['areaatencion'];
            $datregnumactivo->fecha = $parametros['addfecha'];
            $colleObj->add($datregnumactivo);
            $colleObj->save();
        }
        if ($parametros['cmbregimen'] == 1) {
            self::convertirHijosModulos($parametros['idregnumerico']);
        }
        return 1;
    }

    public function convertirHijosModulos($idpadre)
    {
        $hijos = Doctrine::getTable('DatRegnumericoActivo')->findByDql("idpadre = $idpadre and idregnumerico <> $idpadre");
        new DatRegnumericoActivo;
        new DatExpedienteInmueble;
        foreach ($hijos as $pos => $hijo) {
            $hijos[$pos]->esmodulo = 2;
            $hijos[$pos]->DatRegnumerico;
            $hijos[$pos]->DatRegnumerico->DatExpedienteInmueble;
        }
        $hijos->save();
    }

    public function getCargarCheckBox($idregnumerico)
    {
        $query = new Doctrine_Query();
        $query->from('DatExpedienteInmueble expi');
        $query->addSelect('expi.registrocontable,expi.areaatencion');
        $query->addWhere("expi.idexpinmueble = ?", array($idregnumerico));
        $idexpinmueble = $query->fetchArray();

        if (count($idexpinmueble) == 1) {
            $idexpinmueble[0]['registrocontable'];
            $idexpinmueble[0]['areaatencion'];
            return $idexpinmueble;
        } else {
            return 0;
        }
    }

    public function idespecialidadRegimen($idespecialidad)
    {
        if ($idespecialidad) {
            $conn = Zend_Registry::get('conexion');
            $sql = "SELECT DISTINCT nesp.denespecialidad, nesp.codespecialidad,espagrup.denominacioncolumnareporte
                    FROM mod_datosmaestros.nom_indicador i
                    INNER JOIN mod_datosmaestros.nom_especialidad nesp on nesp.idespecialidad = i.idespecialidad
                    INNER JOIN mod_logpatrimonio.conf_espagrupareporte espagrup on espagrup.idespecialidad = i.idespecialidad
                    where nesp.idespecialidad = '$idespecialidad'; ";
            $idespecialidad = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            return $idespecialidad[0];
        } else {
            return 0;
        }
    }

    public function getSistemaConstrutivo($idestructura)
    {
        $result = Doctrine_Query::create()
            ->select('tt.idsistemaconstructivo,tt.denominacion')
            ->from('NomSistemaConstructivo tt')
            ->innerJoin('tt.DatSistemaConstructivoEntidad dtt')
            ->where("dtt.idestructuracomun =" . $idestructura)
            ->fetchArray();
        return $result;
    }

    public function gestEstatusTecnic($idestructura)
    {
        $result = Doctrine_Query::create()
            ->select('est.idestatustecnico,est.denominacion')
            ->from('NomEstatustecnico est')
            ->innerJoin('est.DatEstatustecnicoEntidad dtt')
            ->where("dtt.idestructuracomun =" . $idestructura)
            ->fetchArray();

        return $result;
    }

    public function getGestionarTechosParedes($idestructura, $idtechosParedes)
    {

        $result = Doctrine_Query::create()
            ->select('est.*')
            ->from('NomTipoConstruccion est')
            ->leftJoin('est.DatTipoConstruccionEntidad dtt')
            ->where("dtt.idestructuracomun =" . $idestructura)
            ->where("est.idtipoconstruccion =" . $idtechosParedes)
            ->fetchArray();
        if (count($result) > 0) {
            $result2 = Doctrine_Query::create()
                ->select('est.idtipoconstruccion,mc.denominacion as denominacion
                      ,est.idmaterialesconstruccion')
                ->from('DatTipoMaterialConstruccion est')
                ->innerJoin('est.NomMaterialConstruccion mc')
                ->where("est.idtipoconstruccion =" . $idtechosParedes)
                ->fetchArray();
            return $result2;
        } else {
            return $result;
        }
    }

    public function gesTipologia($idestructura)
    {
        $result = Doctrine_Query::create()
            ->select('est.idtipologia,est.denominacion')
            ->from('NomTipologia est')
            ->innerJoin('est.DatTipologiaEntidad dtt')
            ->where("dtt.idestructuracomun =" . $idestructura)
            ->fetchArray();

        return $result;
    }

    public function getCargarGridConstruccion($parametros)
    {
        $conn = Zend_Registry::get('conexion');

        $sql = "SELECT com.*,nomcom.denominacion
                FROM mod_logpatrimonio.dat_compartimientovivienda com
                inner join mod_logpatrimonio.nom_compartimento nomcom
                on nomcom.idcompartimiento =  com.idcompartimiento
                where com.idregnumerico = {$parametros['idregnumerico']}";
        $total = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if ($parametros['limit']) {
            $sql .= " offset {$parametros['start']} limit {$parametros['limit']}";
        }
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function cargarGridNomOtrasIntslaciones($parametros)
    {
        $query = new Doctrine_Query();

        $query->select('tt.idotrasinstalacionesviv,tt.denominacion');
        $query->from('NomOtrasInstalaciones tt');
        $query->innerJoin('tt.DatOtrasInstalacionesEntidad dtt');
        $query->where("dtt.idestructuracomun =" . $parametros['idestructuracomun']);
        if ($parametros['idotrasinstalacionesviv']) {
            $query->whereNotIn('tt.idotrasinstalacionesviv', $parametros['idotrasinstalacionesviv']);
        }
        $query->limit(($parametros['limit']) ? $parametros['limit'] : 20)
            ->offset(($parametros['start']) ? $parametros['start'] : 0)
            ->orderBy('tt.idotrasinstalacionesviv DESC');
        $datos = $query->fetchArray();
        return $datos;
    }

    public function cargarGridNomCompartimiento($parametros)
    {
        $query = new Doctrine_Query();

        $query->select('tt.idcompartimiento,tt.denominacion');
        $query->from('NomCompartimientos tt');
        $query->innerJoin('tt.DatCompartimientosEntidad dtt');
        $query->where("dtt.idestructuracomun =" . $parametros['idestructuracomun']);
        if ($parametros['idcompartimiento']) {
            $query->whereNotIn('tt.idcompartimiento', $parametros['idcompartimiento']);
        }
        $query->limit(($parametros['limit']) ? $parametros['limit'] : 20)
            ->offset(($parametros['start']) ? $parametros['start'] : 0)
            ->orderBy('tt.idcompartimiento DESC');
        $datos = $query->fetchArray();
        return $datos;
    }

    public function eliminarOtrasInstalaciones($parametros)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('DatOtrasInstalaciones reg')
            ->whereIn('reg.idotrasinstalaciones', $parametros['ids'])
            ->execute();
        return 1;
    }

    public function eliminarCompartimentoVivienda($parametros)
    {
        $query = new Doctrine_Query();
        $query->delete()->from('DatCompartimientovivienda reg')
            ->whereIn('reg.idcompartimiento', $parametros['ids'])->execute();
        return 1;
    }

    public function gestOcupacionViv($idestructura)
    {
        $result = Doctrine_Query::create()
            ->select('est.idocupacionviv,est.denominacion')
            ->from('NomOcupacionViv est')
            ->innerJoin('est.DatOcupacionVivEntidad dtt')
            ->where("dtt.idestructuracomun =" . $idestructura)
            ->fetchArray();

        return $result;
    }

    public function gestVinculacionLaboral($idestructura)
    {
        $result = Doctrine_Query::create()
            ->select('est.idvinculacionlaboral,est.denominacion')
            ->from('NomVinculacionLaboral est')
            ->innerJoin('est.DatVinculacionLaboralEntidad dtt')
            ->where("dtt.idestructuracomun =" . $idestructura)
            ->fetchArray();

        return $result;
    }

    public function getCargarGridOtrasInstalaciones($parametros)
    {
        $conn = Zend_Registry::get('conexion');

        $sql = "SELECT com.*,nomcom.denominacion,com.cantidad as cantidad1
                FROM mod_logpatrimonio.dat_otrasinstalaciones com
                inner join mod_logpatrimonio.nom_otrasinstalacionesviv nomcom
                on nomcom.idotrasinstalacionesviv =  com.idotrasinstalacionesviv
                where com.idregnumerico = {$parametros['idregnumerico']}";

        $total = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if ($parametros['limit']) {
            $sql .= " offset {$parametros['start']} limit {$parametros['limit']}";
        }
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getCargarGridEquiposMedios($parametros)
    {
        $query = new Doctrine_Query();
        $query->select('est.*');
        $query->from('DatEquiposmediosvivienda est');
        $query->where("est.idregnumerico =" . $parametros['idregnumerico']);
        $total = count($query->fetchArray());
        if ($parametros['limit']) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }
        $result = $query->fetchArray();
        return $result;
    }

    public function cargarGridCentralRegNum($parametros)
    {
        /* $regnum = new RegNumericoActivoModel();

          $query = $regnum->getQueryDataVisualizarRegNumActivos($parametros, 'drna');
          $query->addSelect("nmarc.denominacion as marca");
          $query->addSelect("nmod.denominacion as modelo");
          $mMovRegNum = new MovRegNumericoModel();
          $mMovRegNum->addJoinModelMy($query, 'rn', 'mvReg', 1);
          $query->innerJoin("mvReg.DatMovimientos mov");
          $query->innerJoin("mov.DatDocumento doc");
          $query->where('doc.estado = 3');
          $query->addWhere('drna.estaentidad = 1');
          $query->addWhere("p.idestructura = '{$parametros['idestructura']}'");

          $query = self::getWhereRegNum($parametros, $query);
          if ($parametros['limit']) {
          $query->offset($parametros['start']);
          $query->limit($parametros['limit']);
          }
          print_r($query->getSqlQuery());die;
          return $query->fetchArray(); */
        $conn = Zend_Registry::get('conexion');
        $SELECT = "SELECT DISTINCT
                    rna.idregnumerico,
                    rna.annofabricacion as annofabricacion,
                    rna.idestatustecnico,
                    rna.nroinventario,

                    rna.valoradquisicion,
                    rna.valorcontable,
                    rna.fechaadq,
                    rna.annofabricacion,                 
                    rna.idactividad,
                    rna.idestatustecnico,
                    rna.idcategoria,
                    rna.idresponsable,
                    resp.idpersona,
                    act.denominacion as denomactividad,
                    persona.nombre || ' ' || persona.papel  || ' ' || persona.sapel as denompersona,
                    tr.indiceconsumo,
                    tr.indicativo,
                    tr.ficav,
                    tr.lot,
                    estatus.denominacion as denomestatustecnico,

                    rn.nroserie as nroserie,
                    color.denominacion as colorptim,
                    colorsec.denominacion as colorsec,
                    ind.codigo as codigo,
                    ind.denominacion as denominacion,
                    nm.denominacion as marca,
                    nmod.denominacion as modelo,
                    dm.idproducto, pro.idindicador as idindicador,
                    pais.nombrepais as nacionalidad
                    ";
        //estatus.denominacion as denomestado

        $FROM = "      FROM mod_logactivofijotangible.dat_regnumericoactivo rna

                      inner join mod_logactivofijotangible.dat_registronumerico rn on rna.idregnumerico = rn.idregnumerico

                      left join mod_logactivofijotangible.nom_actividad act on rna.idactividad = act.idactividad
                      left join mod_logactivofijotangible.dat_responsable resp on rna.idresponsable = resp.idresponsable
                      left join mod_persona.dat_persona persona on resp.idpersona = persona.idpersona

                      left join mod_logactivofijotangible.nom_estatustecnico estatus
                      on estatus.idestatustecnico = rna.idestatustecnico
                      inner join mod_logistica.dat_producto pro on pro.idproducto = rn.idproducto
                      inner join mod_logistica.dat_movimiento dm on dm.idproducto = pro.idproducto
                      inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
                      INNER JOIN mod_estructuracomp.nom_filaestruc f ON pro.idestructuracomun = f.idfila
                      left join mod_datosmaestros.nom_indicador ind on ind.idindicador = pro.idindicador
                      left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ind.idnaturaleza
                      left join mod_datosmaestros.nom_pais pais on pais.idpais = ind.idpais
                      left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ind.idindicador
                      left join mod_datosmaestros.nom_marca nm on nm.idmarca = nih.idmarca
                      left join mod_datosmaestros.nom_modelo nmod on nmod.idmodelo = nih.idmodelo
                      left join mod_logactivofijotangible.dat_regnumericoactivotransp tr
                      on tr.idregnumerico = rna.idregnumerico
                      left join mod_logactivofijotangible.nom_tipocombustible tcom
                      on tcom.idtipocombustible = tr.idtipocombustible
                      left join mod_logactivofijotangible.nom_color color on color.idcolor = rna.idcolorprim
                      left join mod_logactivofijotangible.nom_color colorsec on colorsec.idcolor = rna.idcolorsec";

        if ($parametros['enviadorepararaction']) {
            $FROM .= " INNER JOIN mod_logistica.dat_movregnumerico mvReg on dm.idmovimiento = mvReg.idmovimiento
            INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mvRegAct
            on mvReg.idmovregnumerico = mvRegAct.idmovregnumerico
            ";
        }
// inner join mod_logactivofijotangible.nom_estatustecnico estatus on rna.idestatustecnico = estatus.idestatustecnico

        $WHERE = " WHERE dd.estado = 3 and rna.estaentidad = 1 and rna.idestadoperacion = 1 
           /* and rna.idestadoperacion = 3*/ AND f.idfila IN (
                SELECT idfila FROM mod_estructuracomp.nom_filaestruc
                    WHERE idfila = {$parametros['idestructura']}) ";


        $WHERE = self::getWhereRegNum($parametros, $WHERE);

        $sqlDatos = $SELECT . $FROM . $WHERE;
        $sqlCount = 'SELECT count (DISTINCT rna.idregnumerico) ' . $FROM . $WHERE;
        $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
        if ($parametros['limit']) {
            $sqlDatos .= " offset({$parametros['start']}) limit({$parametros['limit']})";
        }


        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);

        $total = $total[0]['count'];
        return array($datos, $total);
    }

    public function getWhereRegNum($parametros, $WHERE)
    {
        if (count($parametros['arrRNnomostrar']) != 0) {
            $WHERE .= " and rna.idregnumerico not in (" . implode(',', $parametros['arrRNnomostrar']) . ")";
        }
        if ($parametros['codigo']) {
            $codigo = $parametros['codigo'];
            $WHERE .= " AND ind.codigo iLIKE  '%$codigo%'";
        }

        if ($parametros['idnaturaleza']) {
            $idnaturaleza = $parametros['idnaturaleza'];
            $WHERE .= " AND nat.idnaturaleza = $idnaturaleza";
        }
        if ($parametros['descripcion']) {
            $descripcion = $parametros['descripcion'];
            $WHERE .= " AND ind.denominacion iLIKE  '%$descripcion%'";
        }
        if ($parametros['modelo']) {
            $modelo = $parametros['modelo'];
            $WHERE .= " AND nmod.idmodelo = $modelo";
        }
        if ($parametros['marca']) {
            $marca = $parametros['marca'];
            $WHERE .= " AND nm.idmarca = $marca";
        }
        if ($parametros['colorprim']) {
            $colorprim = $parametros['colorprim'];
            $WHERE .= " AND color.idcolor = $colorprim";
        }
        if ($parametros['colorsec']) {
            $colorsec = $parametros['colorsec'];
            $WHERE .= " AND colorsec.idcolor = $colorsec";
        }
        if ($parametros['estado']) {
            $estado = $parametros['estado'];
            $WHERE .= " AND estatus.idestatustecnico = $estado";
        }
        if ($parametros['idnaturalezaexcluir']) {
            $idnat = implode(',', $parametros['idnaturalezaexcluir']);
            $WHERE .= " AND nat.idnaturaleza NOT IN($idnat)";
        }
        return $WHERE;
    }

    public function eliminarEquiposMediosVivienda($parametros)
    {
        $queryselect = new Doctrine_Query();
        $queryselect->from('DatEquiposmediosvivienda reg')
            ->whereIn('reg.idequipomedio', $parametros['ids']);
        $dats = $queryselect->fetchArray();

        foreach ($dats as $ids) {
            $dataft = Doctrine::getTable('DatRegnumericoActivo')->find($ids['idregnumactivo']);
            $dataft->idestadoperacion = 1;
            $dataft->save();
        }
        $query = new Doctrine_Query();
        $query->delete()->from('DatEquiposmediosvivienda reg')
            ->whereIn('reg.idequipomedio', $parametros['ids'])->execute();

        return 1;
    }

    public function getCargarTipoObra($idestructura)
    {

        $result = Doctrine_Query::create()
            ->select('c.idtipoobra,c.denominacion')
            ->from('NomTipoObra c')
            ->innerJoin('c.DatTipoObraEntidad ce')
            ->where("ce.idestructuracomun =" . $idestructura)
            ->fetchArray();
        return $result;
    }

    public function gestSelladaPor($parametros)
    {
        $where = ' where ';
        if ($parametros['limit']) {
            $limit = " limit {$parametros['limit']}";
            $limit .= " offset {$parametros['start']}";
        }


        $conn = Zend_Registry::get('conexion');
        $sql = "select t.denominacion,t.idestatusoperativo as idselladapor
                from mod_logactivofijotangible.dat_estatustecnicoestatusoperativo e
                inner join mod_logactivofijotangible.nom_estatusoperativo t on t.idestatusoperativo = e.idestatusoperativo ";
        $sqlCount = "SELECT count(DISTINCT t.idestatusoperativo)
               from mod_logactivofijotangible.dat_estatustecnicoestatusoperativo e
                inner join mod_logactivofijotangible.nom_estatusoperativo t
                 on t.idestatusoperativo = e.idestatusoperativo";
        if ($parametros['idpadre']) {
            $idpadre = $parametros['idpadre'];
            $where .= " e.idestatustecnico = $idpadre ";
            $sqlDatos = $sql . $where . $limit;
        } else
            $sqlDatos = $sql . $limit;


        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);


        return $datos;
    }

    public function getNomDesignacion($idestructura)
    {
        $result = Doctrine_Query::create()
            ->select('d.*')
            ->from('NomDesignacion d')
            ->innerJoin('d.DatDesignacionEntidad de')
            ->where("de.idestructuracomun =" . $idestructura)
            ->fetchArray();
        return $result;
    }

    public function getNomCaractConstructiva($idestructura)
    {

        $result = Doctrine_Query::create()
            ->select('cc.*')
            ->from('NomConstructiva cc')
            ->innerJoin('cc.DatConstructivaEntidad cce')
            ->where("cce.idestructuracomun =" . $idestructura)
            ->fetchArray();
        return $result;
    }

    public function getNomVentilacion($idestructura)
    {

        $result = Doctrine_Query::create()
            ->select('v.*')
            ->from('NomTipoVentilacion v')
            ->innerJoin('v.DatTipoVentilacionEntidad ve')
            ->where("ve.idestructuracomun =" . $idestructura)
            ->fetchArray();
        return $result;
    }

    public function getNomComunicacion($idestructura)
    {

        $result = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomTipoComunicacion c')
            ->innerJoin('c.DatTipoComunicacionEntidad ce')
            ->where("ce.idestructuracomun =" . $idestructura)
            ->fetchArray();
        return $result;
    }

    public function getNomSistEnergetico($idestructura)
    {
        $result = Doctrine_Query::create()
            ->select('se.*')
            ->from('NomSistemaEnergetico se')
            ->innerJoin('se.DatSistemaEnergeticoEntidad see')
            ->where("see.idestructuracomun =" . $idestructura)
            ->fetchArray();
        return $result;
    }

    public function getNomSeccion($idestructura)
    {

        $result = Doctrine_Query::create()
            ->select('d.*')
            ->from('NomTipoSeccion d')
            ->innerJoin('d.DatTipoSeccionEntidad de')
            ->where("de.idestructuracomun =" . $idestructura)
            ->fetchArray();
        return $result;
    }

    public function getLocalesObrasIng($parametros)
    {

        $query = new Doctrine_Query();

        $query->select('lo.*,nl.denominacion as tipo,ns.denominacion as seccion');

        $query->from('DatLocalObrasIng lo')
            ->innerJoin('lo.NomLocal nl')
            ->innerJoin('lo.NomTipoSeccion ns');

        $query->where("lo.idregnumerico = ?", $parametros['idregnumerico']);

        $query->limit(($parametros['limit']) ? $parametros['limit'] : 20)
            ->offset(($parametros['start']) ? $parametros['start'] : 0);

        return $query->fetchArray();
    }

    public function getNomLocal($parametros)
    {

        if (!$parametros['identidad']) {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = $global->Estructura->idestructura;
        } else {
            $idestructura = $parametros['identidad'];
        }

        $conn = Zend_Registry::get('conexion');
        $sql = "select m.*";
        $sqlfrom = " FROM mod_logpatrimonio.nom_local m
                    INNER JOIN mod_logpatrimonio.dat_localentidad d                   
                    on (m.idlocal = d.idlocal)";

        $WHERE = " WHERE  d.idestructuracomun = {$idestructura}";

        if ($parametros['idlocal'])
            $WHERE .= "  AND  m.idlocal not in (" . implode(',', $parametros['idlocal']) . ") ";

        return $conn->execute($sql . $sqlfrom . $WHERE)->fetchAll(
            PDO::FETCH_ASSOC
        );
    }

    public function eliminarLocalesObrasIng($parametros)
    {

        $query = new Doctrine_Query();
        $query->delete()
            ->from('DatLocalObrasIng li')
            ->where('li.idregnumericoactivo = ?', array($parametros['idregnumericoactivo']))
            ->whereIn('li.idlocalesobrasing', $parametros['ids'])
            ->execute();
        return 1;
    }

    public function getDatosObrasAsoc($parametros)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT ind.denominacion,rna.idregnumerico,rna.nroinventario/*,indh.puntofuego*/,obras.cantidad
                FROM mod_logactivofijotangible.dat_regnumericoactivo rna
                inner join  mod_logactivofijotangible.dat_registronumerico rn on rna.idregnumerico = rn.idregnumerico
                inner join mod_logistica.dat_producto pro on pro.idproducto = rn.idproducto
                left join mod_datosmaestros.nom_indicador ind on ind.idindicador = pro.idindicador
                LEFT JOIN mod_datosmaestros.nom_indicadorhoja indh on ind.idindicador = indh.idindicador
                LEFT JOIN mod_logpatrimonio.dat_obrasasociadasing obras on rna.idregnumerico = obras.idregnumerico
                ";

        $where = " where rna.idpadre = {$parametros['idregnumerico']} and rna.idregnumerico <> {$parametros['idregnumerico']}";
        $sqlCount = "SELECT ind.denominacion,rna.idregnumerico,rna.nroinventario,obras.cantidad
                FROM mod_logactivofijotangible.dat_regnumericoactivo rna
                inner join  mod_logactivofijotangible.dat_registronumerico rn on rna.idregnumerico = rn.idregnumerico
                inner join mod_logistica.dat_producto pro on pro.idproducto = rn.idproducto
                left join mod_datosmaestros.nom_indicador ind on ind.idindicador = pro.idindicador
                LEFT JOIN mod_logpatrimonio.dat_obrasasociadasing obras on rna.idregnumerico = obras.idregnumerico
                LEFT JOIN mod_datosmaestros.nom_indicadorhoja indh on ind.idindicador = indh.idindicador";

        if ($parametros['limit']) {
            $limit = " limit {$parametros['limit']}";
            $limit .= " offset {$parametros['start']}";
        }

        $sqlDatos = $sql . $where . $limit;

        $sqlCount = $sqlCount . $where;
        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        $countdatos = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
        /**/
    }

    public function eliminarDatosContables($parametros)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('DatDatosContables dc')
            ->where('dc.idregnumerico = ?', array($parametros['idregnumerico']))
            ->whereIn('dc.iddatcontableinmcamp', $parametros['ids'])
            ->execute();
        return 1;
    }

    public function getDatosContables($parametros)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "select dc.*";
        $sqlfrom = " FROM mod_logpatrimonio.dat_datcontableinmcamp dc";
        $WHERE = " WHERE dc.idregnumerico = {$parametros['idregnumerico']}";

        $total = count($conn->execute($sql . $sqlfrom . $WHERE)->fetchAll(PDO::FETCH_ASSOC));

        if ($parametros['limit']) {
            $limit = " offset {$parametros['start']} limit {$parametros['limit']}";
        }
        $datos = $conn->execute($sql . $sqlfrom . $WHERE . $limit)->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    public function getObjetosObraCamp($parametros)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "select m.*, d.denominacion as sistema, ind.denominacion, rna.idregnumerico";
        $sqlfrom = " FROM mod_logactivofijotangible.dat_regnumericoactivo rna
                    left JOIN mod_logpatrimonio.dat_objetoobracomp m
                    ON(rna.idregnumerico = m.idobjetoobracomp)
                    LEFT JOIN mod_logpatrimonio.nom_sistemaconstructivo d 
                    ON(m.idsistemaconstructivo = d.idsistemaconstructivo)
                    
                    inner join mod_logactivofijotangible.dat_registronumerico rn on rna.idregnumerico = rn.idregnumerico
                    inner join mod_logistica.dat_producto pro on pro.idproducto = rn.idproducto
                    INNER JOIN mod_estructuracomp.nom_filaestruc f ON pro.idestructura = f.idfila
                    inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = pro.idindicador";

        $WHERE = " WHERE  f.idfila IN ({$parametros['idarea']}
                   /* SELECT idfila FROM mod_estructuracomp.nom_filaestruc
                       WHERE
                       lft >= (SELECT lft FROM mod_estructuracomp.nom_filaestruc WHERE idfila = {$parametros['idarea']}) AND
                       rgt <= (SELECT rgt FROM mod_estructuracomp.nom_filaestruc WHERE idfila = {$parametros['idarea']})
                   */) ";

        if ($parametros['id']) {
            $WHERE .= " and rna.idregnumerico in (" . implode(',', $parametros['id']) . ")";
        } else {
            $WHERE .= " and rna.idregnumerico = -1 ";
        }
        $total = count($conn->execute($sql . $sqlfrom . $WHERE)->fetchAll(PDO::FETCH_ASSOC));

        if ($parametros['limit']) {
            $limit = " offset {$parametros['start']} limit {$parametros['limit']}";
        }

        $datos = $conn->execute($sql . $sqlfrom . $WHERE . $limit)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getCaracTecnicasEstado($parametros)
    {

        $query = new Doctrine_Query();

        $query->select('ct.idtipocontruccion,ct.porciento,
                        nt.denominacion as partes, 
                        et.denominacion as estado,
                        et.idestatustecnico as idestatustecnico,
                        mtp.idmaterialconstruccion,
                        mc.denominacion');

        $query->from('DatCaractTecnicaCamp ct')
            ->innerJoin('ct.NomTipoConstruccion nt')
            ->innerJoin('ct.NomEstatustecnico et')
            ->leftJoin('ct.DatMatConsInmuCamp mtp ')
            ->leftJoin('mtp.NomMaterialConstruccion mc');

        $query->where("ct.idregnumerico = ?", $parametros['idregnumerico']);
        $query->limit(($parametros['limit']) ? $parametros['limit'] : 20)
            ->offset(($parametros['start']) ? $parametros['start'] : 0);
        return $query->fetchArray();
    }

    public function getDestinoLocales($parametros)
    {

        $conn = Zend_Registry::get('conexion');
        $sql = "select dl.idlocal as idlocales, dl.aream2 as aream2, dl.cantidad ,dl.clave,dl.iddestinolocalinmcomp,nl.denominacion";
        $sqlfrom = " FROM mod_logpatrimonio.dat_destinolocalinnmcamp dl
                    LEFT JOIN mod_logpatrimonio.nom_local nl on nl.idlocal = dl.idlocal
                     ";
        $WHERE = " WHERE dl.idregnumerico = {$parametros['idregnumerico']}";
        $total = count($conn->execute($sql . $sqlfrom . $WHERE)->fetchAll(PDO::FETCH_ASSOC));

        if ($parametros['limit']) {
            $limit = " offset {$parametros['start']} limit {$parametros['limit']}";
        }

        $datos = $conn->execute($sql . $sqlfrom . $WHERE . $limit)->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    public function getNomTipoConstruccion($parametros)
    {

        if (!$parametros['identidad']) {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = $global->Estructura->idestructura;
        } else {
            $idestructura = $parametros['identidad'];
        }

        $conn = Zend_Registry::get('conexion');
        $sql = "select m.idtipoconstruccion as idtipocontruccion, m.denominacion,m.estado";
        $sqlfrom = " FROM mod_logpatrimonio.nom_tipoconstruccion m
                    INNER JOIN mod_logpatrimonio.dat_tipoconstruccionentidad d
                    on (m.idtipoconstruccion = d.idtipoconstruccion)";

        $WHERE = " WHERE  d.idestructuracomun = {$idestructura}";

        if ($parametros['idtipocontruccion'])
            $WHERE .= " AND m.idtipoconstruccion not in (" . implode(',', $parametros['idtipocontruccion']) . ") ";

        return $conn->execute($sql . $sqlfrom . $WHERE)->fetchAll(
            PDO::FETCH_ASSOC
        );
    }

    public function GetNomMaterialConstruccion($parametros)
    {
        $query = new Doctrine_Query();

        $query->from('NomMaterialConstruccion mod')->innerJoin('mod.DatTipoMaterialConstruccion mm')->innerJoin('mm.NomTipoConstruccion m');

        $query->addSelect(
            'mod.idmaterialesconstruccion, mod.denominacion, mod.idmaterialesconstruccion as id, mod.denominacion as text, mod.estado, true as leaf'
        );
        if ($parametros['idpadre']) {
            $query->addWhere("mm.idtipoconstruccion = ?", $parametros['idpadre']);
        }

        return $query->fetchArray();
    }

    public function getNomSistemaConst($parametros)
    {

        if (!$parametros['identidad']) {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = $global->Estructura->idestructura;
        } else {
            $idestructura = $parametros['identidad'];
        }

        $conn = Zend_Registry::get('conexion');
        $sql = "select m.*";
        $sql .= " FROM mod_logpatrimonio.nom_sistemaconstructivo m
                    INNER JOIN mod_logpatrimonio.dat_sistemaconstructivoentidad d
                    on m.idsistemaconstructivo = d.idsistemaconstructivo
                    WHERE d.idestructuracomun = {$idestructura} ";

        $total = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        if ($parametros['limit']) {
            $sql .= " offset {$parametros['start']} limit {$parametros['limit']}";
        }

        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;


        //  return array('datos'=>$conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC ),'total'=>count($total));
    }

    public function guardarRegistroVivienda($parametros)
    {
        $tabuno = Zend_Json::decode(stripcslashes($parametros['tab0']));
        $tabdos = Zend_Json::decode(stripcslashes($parametros['tab1']));
        $tabtres = Zend_Json::decode(stripcslashes($parametros['tab2']));
        $tabcuatro = Zend_Json::decode(stripcslashes($parametros['tab3']));
        $tabcinco = Zend_Json::decode(stripcslashes($parametros['tab4']));
        $dataft = Doctrine::getTable('DatRegnumericoActivo')->find($parametros['idregnumerico']);
        $dataft->save();


        if (count($tabuno) > 0) {
            $tabla = 'DatIdentificacionvivienda';
            $perfil = 'Perfil';
            $global = ZendExt_GlobalConcept::getInstance();
            $idusuario = $global->$perfil->idusuario;
            $tab = $tabuno;
            $tab['idregnumerico'] = $parametros['idregnumerico'];
            $tab['idautoriza'] = $idusuario;
            $this->getInstanceRegistrar($tabla, $tab);
        }
        if (count($tabdos) > 0) {
            $tabla = 'DatUbicacionvivienda';
            $tab = $tabdos;
            $tab['idregnumerico'] = $parametros['idregnumerico'];
            $this->getInstanceRegistrar($tabla, $tab);
        }
        if (count($tabtres) > 0) {
            $tabla = 'DatConstruccionvivienda';
            $tab = $tabtres;
            $tab['idregnumerico'] = $parametros['idregnumerico'];
            $this->getInstanceRegistrar($tabla, $tab);
            if (count($tab['grid']) > 0) {
                $this->getInstanceGrids(
                    $tab['grid'], $parametros['idregnumerico'], 'DatCompartimientovivienda', 'idcompartimiento', 3
                );
            }
        }
        if (count($tabcuatro) > 0) {
            $tabla = 'DatAuxiliarlesvivienda';
            $tab = $tabcuatro;
            $tab['idregnumerico'] = $parametros['idregnumerico'];
            $this->getInstanceRegistrar($tabla, $tab);
            if (count($tab['grid']) > 0) {
                $this->getInstanceGrids(
                    $tab['grid'], $parametros['idregnumerico'], 'DatOtrasInstalaciones', 'idotrasinstalacionesviv', 4
                );
            }
        }
        if (count($tabcinco) > 0) {
            $tab = $tabcinco;
            $this->getInstanceGrids(
                $tab['grid'], $parametros['idregnumerico'], 'DatEquiposmediosvivienda', 'idequipomedio', 5
            );
            foreach ($tab['grid'] as $tab) {
                $dataftP = Doctrine::getTable('DatRegnumericoActivo')->find($tab['idregnumactivo']);
                $dataftP->idestadoperacion = 10;
                $dataftP->save();
            }
        }

        return 1;
    }

    public function guardarRegistroIng($parametros)
    {

        $tabuno = Zend_Json::decode(stripcslashes($parametros['tab0']));
        $tabdos = Zend_Json::decode(stripcslashes($parametros['tab1']));
        $tabtres = Zend_Json::decode(stripcslashes($parametros['tab2']));
        $tabcuatro = Zend_Json::decode(stripcslashes($parametros['tab3']));
        $dataft = Doctrine::getTable('DatRegnumericoActivo')->find($parametros['idregnumerico']);
        $dataft->save();
        if (count($tabuno) > 0) {
            $tabla = 'DatIdentificacionInmuebleIng';
            $tab = $tabuno;
            $tab['idindentificacioninmuebleing'] = $parametros['idregnumerico'];
            $perfil = 'Perfil';
            $global = ZendExt_GlobalConcept::getInstance();
            $idusuario = $global->$perfil->idusuario;
            $tab['idautoriza'] = $idusuario;
            $this->getInstanceRegistrar($tabla, $tab, 'idindentificacioninmuebleing');
        }
        if (count($tabdos) > 0) {
            $tabla = 'DatObrasProtectorasInmuebleIng';
            $tab = $tabdos;
            $tab['idobrasing'] = $parametros['idregnumerico'];
            $this->getInstanceRegistrar($tabla, $tab, 'idobrasing');
            if ($tab['idtipocomunicacion']) {
                $this->addTiposComunicacion($tab, $parametros['idregnumerico']);
            }
            if (count($tab['grid']) > 0) {
                $this->getInstanceGrids(
                    $tab['grid'], $parametros['idregnumerico'], 'DatLocalObrasIng', 'idlocalesobrasing', 5
                );
            }
        }
        if (count($tabtres) > 0) {
            $tab = $tabtres;
            $tab['idregnumerico'] = $parametros['idregnumerico'];
            if (count($tab['grid']) > 0) {
                $this->guardarDatosObrasAsociadas($tab);
            }
        }
        if (count($tabcuatro) > 0) {
            $tabla = 'DatGenDatosContables';
            $tab = $tabcuatro;
            $tab['idregnumerico'] = $parametros['idregnumerico'];
            $this->getInstanceRegistrar($tabla, $tab, false);
            if (count($tab['grid']) > 0) {
                $this->getInstanceGrids(
                    $tab['grid'], $parametros['idregnumerico'], 'DatDatosContables', 'iddatcontableinmcamp', 5
                );
            }
        }

        return 1;
    }

    public function guardarRegistroCamp($parametros)
    {
        $tabuno = Zend_Json::decode(stripcslashes($parametros['tab0']));
        $tabdos = Zend_Json::decode(stripcslashes($parametros['tab1']));
        $tabtres = Zend_Json::decode(stripcslashes($parametros['tab2']));
        $tabcuatro = Zend_Json::decode(stripcslashes($parametros['tab3']));
        $tabcinco = Zend_Json::decode(stripcslashes($parametros['tab4']));
        $dataft = Doctrine::getTable('DatRegnumericoActivo')->find($parametros['idregnumerico']);
        $dataft->save();

        if (count($tabuno) > 0) {
            $tabla = 'DatIdentificacionInmuebleCamp';
            $tab = $tabuno;
            $tab['idindentificacioninmueble'] = $parametros['idregnumerico'];
            $perfil = 'Perfil';
            $global = ZendExt_GlobalConcept::getInstance();
            $idusuario = $global->$perfil->idusuario;
            $tab['idautoriza'] = $idusuario;
            $this->getInstanceRegistrar($tabla, $tab, 'idindentificacioninmueble');
        }
        if (count($tabdos) > 0) {
            $tab = $tabdos;
            $tab['idobjetoobracomp'] = $parametros['idregnumerico'];
            $this->guardarObjetoObra($tab, $parametros['espadre'], $parametros['idregnumerico'], $tabuno);
        }
        if (count($tabtres) > 0) {
            $tab = $tabtres;
            $tab['grid'][0]['idmaterialesconstruccion'] = split(',', $tab['grid'][0]['idmaterialesconstruccion']);
            $tab['idregnumerico'] = $parametros['idregnumerico'];
            if (count($tab['grid']) > 0) {
                $this->guardarCaracteristicas($tab);
                /*  $this->getInstanceGrids(
                  $tab['grid'], $parametros['idregnumerico'], 'DatCaractTecnicaCamp', 'idcaracteristicainmcamp', 5
                  ); */
            }
        }
        if (count($tabcuatro) > 0) {
            $tab = $tabcuatro;
            if (count($tab['grid']) > 0) {
                $this->getInstanceGrids(
                    $tab['grid'], $parametros['idregnumerico'], 'DatDestinoLocalesCamp', 'iddestinolocalinmcomp', 5
                );
            }
        }
        if (count($tabcinco) > 0) {
            $tab = $tabcinco;
            $tabla = 'DatGenDatosContables';
            $tab = $tabcinco;
            $tab['idregnumerico'] = $parametros['idregnumerico'];
            $this->getInstanceRegistrar($tabla, $tab);
            if (count($tab['grid']) > 0) {
                $this->getInstanceGrids(
                    $tab['grid'], $parametros['idregnumerico'], 'DatDatosContables', 'iddatcontableinmcamp', 5
                );
            }
        }
        return 1;
    }

    public function obtenerObjetosObras($idsaux)
    {
        foreach ($idsaux as $id) {
            $existe = Doctrine::getTable('DatRegistObjObraCamp')->find($id);
            if ($existe) {
                $mcuadrado += $existe->mcuadrado;
            }
        }
        return $mcuadrado;
    }

    private function guardarCaracteristicas($parametros)
    {
        $colecctionCaractTecnicas = new Doctrine_Collection('DatCaractTecnicaCamp');

        foreach ($parametros['grid'] as $value) {
            if ($value['idcaracteristicainmcamp'] == '') {
                $colecctionCaractTecnicas->add(
                    $this->guardarCaracteristicasAux($parametros, $value)
                );
                $colecctionCaractTecnicas->save();
                /*  $objeto = new DatCaractTecnicaCamp();
                  $objeto->idregnumerico = $parametros['idregnumerico'];
                  $objeto->synchronizeWithArray($value);
                  // print_r($value['idmaterialesconstruccion']);
                  if (count($value['idmaterialesconstruccion']) > 1) {
                  foreach ($value['idmaterialesconstruccion'] as $index => $valuemate) {
                  $objeto->DatMatConsInmuCamp[$index]->idmaterialconstruccion = $valuemate;
                  }
                  } else {
                  $objeto->DatMatConsInmuCamp[0]->idmaterialconstruccion = $value['idmaterialesconstruccion'];
                  }
                  $colecctionCaractTecnicas->add($objeto); */
            } else {
                $existe = Doctrine::getTable('DatCaractTecnicaCamp')->find($value['idcaracteristicainmcamp']);

                if ($existe) {
                    $existe->delete();
                    $existedos = Doctrine::getTable('DatCaractTecnicaCamp')->find($value['idcaracteristicainmcamp']);

                    if (!$existedos) {
                        unset($value['idcaracteristicainmcamp']);
                        $colecctionCaractTecnicas->add(
                            $this->guardarCaracteristicasAux($parametros, $value)
                        );
                        $colecctionCaractTecnicas->save();
                    }
                }
            }
        }
    }

    public function guardarCaracteristicasAux($parametros, $value)
    {
        $objeto = new DatCaractTecnicaCamp();
        $objeto->idregnumerico = $parametros['idregnumerico'];
        $objeto->synchronizeWithArray($value);

        if (is_string($value['idmaterialesconstruccion'])) {
            $value['idmaterialesconstruccion'] = explode(',', $value['idmaterialesconstruccion']);
        }
        if (!is_array($value['idmaterialesconstruccion'])) {
            $value['idmaterialesconstruccion'] = array($value['idmaterialesconstruccion']);
        }

        foreach ($value['idmaterialesconstruccion'] as $index => $valuemate) {
            $objeto->DatMatConsInmuCamp[$index]->idmaterialconstruccion = $valuemate;
        }
        return $objeto;
    }

    public function guardarObjetoObra($parametros, $espadre, $idregnumerico, $tabuno)
    {

        $colecctionObjetosObra = new Doctrine_Collection('DatRegistObjObraCamp');
        $cantMetros = 0;
        foreach ($parametros['grid'] as $value) {
            $existe = Doctrine::getTable('DatRegistObjObraCamp')->find($value['idregnumerico']);
            $cantMetros += $value['mcuadrado'];
            if ($existe) {
                $existe->synchronizeWithArray($value);
                $existe->idobjetoobracomp = $value['idregnumerico'];
                $colecctionObjetosObra->add($existe);
            } else {
                $objetoObra = new DatRegistObjObraCamp();
                $objetoObra->synchronizeWithArray($value);
                $objetoObra->idobjetoobracomp = $value['idregnumerico'];
                $colecctionObjetosObra->add($objetoObra);
            }
        }
        $colecctionObjetosObra->save();
        if ($espadre && !$tabuno['area']) {
            $tab['idindentificacioninmueble'] = $idregnumerico;
            $tab['area'] = $cantMetros;
            $tabla = 'DatIdentificacionInmuebleCamp';
            $this->getInstanceRegistrar($tabla, $tab, 'idindentificacioninmueble');
        }
        return 1;
    }

    //Zend_Json::decode

    public function getInstanceRegistrar($tabla, $parametros, $idAux)
    {

        if ($idAux) {
            $datIdentificacion = Doctrine::getTable($tabla)->find($parametros[$idAux]);
            $id = $datIdentificacion->$idAux;
        } else {
            $datIdentificacion = Doctrine::getTable($tabla)->find($parametros['idregnumerico']);
            $id = $datIdentificacion->idregnumerico;
        }

        if ($id) {
            $datIdentificacion->synchronizeWithArray($parametros);
            $datIdentificacion->save();
        } else {
            $datIdentificacion = new $tabla();
            $datIdentificacion->synchronizeWithArray($parametros);
            $datIdentificacion->save();
        }
        return $datIdentificacion;
    }

    public function getInstanceGrids($datGrid, $idregnumerico, $tabla, $id, $tab)
    {
        foreach ($datGrid as $index => $dat) {

            $datId = Doctrine_Query::create()
                ->select("est.{$id}")
                ->from("{$tabla} est")
                ->where("est.idregnumerico =" . $idregnumerico);
            if ($tab == 5) {
                if ($dat[$id]) {
                    $datId->addWhere("est.{$id} =" . $dat[$id]);
                    $datId = $datId->fetchArray();
                } else {
                    $datId->addWhere("est.{$id} =" . -1);
                    $datId = $datId->fetchArray();
                }
            } else
                $datId = $datId->addwhere("est.{$id} =" . $dat[$id])->fetchArray();

            $dat['idregnumerico'] = $idregnumerico;

            if (count($datId) > 0) {
                $datIde = Doctrine::getTable($tabla)->findByDql("{$id} = ?", array($dat[$id]));
                $datIde[0]->synchronizeWithArray($datGrid[$index]);
                $datIde->save();
            } else {
                $datIde = new $tabla();
                $datIde->synchronizeWithArray($dat);
                $datIde->save();
            }
        }
    }

    public function addTiposComunicacion($parametros, $idregnumerico)
    {
        Doctrine_Query::create()->delete('DatObrasProtectorasInmTipoComunicacion opinm')
            ->Where('opinm.idobrasing = ?', array($idregnumerico))
            ->execute();
        $dat = explode(',', $parametros['idtipocomunicacion']);
        $tipoComunicacionColle = new Doctrine_Collection('DatObrasProtectorasInmTipoComunicacion');
        $query = Doctrine_Query::create();

        foreach ($dat as $id) {

            if ($this->obrasProtectorasTipoComunicacion($id, $result[0]['idobrasing']) == 0) {
                $tipoComunicacion = new DatObrasProtectorasInmTipoComunicacion();
                $tipoComunicacion->idobrasing = $idregnumerico;
                $tipoComunicacion->idtipocomunicacion = $id;
                $tipoComunicacionColle->add($tipoComunicacion);
            }
        }
        $tipoComunicacionColle->save();
    }

    public function obrasProtectorasTipoComunicacion($idtipocomunicacion, $idobrasing)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('vtt.idtipocomunicacioninm')
            ->from('DatObrasProtectorasInmTipoComunicacion vtt')
            ->Where('vtt.idobrasing = ? AND vtt.idtipocomunicacion = ?', array($idobrasing, $idtipocomunicacion))
            ->count();
        return $result;
    }

    private function guardarDatosObrasAsociadas($parametros)
    {
        $colecction = new Doctrine_Collection('DatObrasAsociadasIng');
        foreach ($parametros['grid'] as $value) {
            settype($value, 'array');
            $existeObrasAsociadasIng = Doctrine::getTable('DatObrasAsociadasIng')->find($value['idregnumerico']);
            
            if (!$existeObrasAsociadasIng) {
                $datos = new DatObrasAsociadasIng();
                $datos->synchronizeWithArray($value);
                $colecction->add($datos);
            } else {
                $existeObrasAsociadasIng->synchronizeWithArray($value);
                $colecction->add($existeObrasAsociadasIng);
            }
        }
        $colecction->save();
    }

    public function cargarRegistrosVivienda($parametros)
    {

        $conn = Zend_Registry::get('conexion');

        $sql = "SELECT d.*
                FROM mod_logpatrimonio.dat_identificacionvivienda d
                left JOIN mod_logpatrimonio.nom_regimen m ON d.idregimen = m.idregimen
                --left JOIN mod_persona.dat_persona per on per.idpersona = d.idpersona
                WHERE d.idregnumerico = {$parametros['idregnumerico']}";
        $datos[] = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        $sqldos = "SELECT d.*, dpt.denominacion as provincia,dpt1.denominacion as denommunicipio
                  FROM mod_logpatrimonio.dat_ubicacionvivienda d
                  left JOIN mod_datosmaestros.nom_dpt dpt on dpt.iddpt = d.idprovincia
                  left JOIN mod_datosmaestros.nom_dpt dpt1 on dpt1.iddpt = d.idmunicipio
                  WHERE d.idregnumerico = {$parametros['idregnumerico']}";
        $datos[] = $conn->execute($sqldos)->fetchAll(PDO::FETCH_ASSOC);

        $sql3 = "SELECT c.*,
                    s.denominacion as denomsistemaconstructivo,
                    st.denominacion as denomestatustecnico,
                    m.denominacion as denomtechode,
                    m1.denominacion as denomparedesde,
                    t.denominacion as denomtipologia
                  FROM mod_logpatrimonio.dat_construccionvivienda c
                  left JOIN mod_logpatrimonio.nom_sistemaconstructivo  s
                  on s.idsistemaconstructivo = c.idsistemaconstructivo
                  left JOIN mod_logactivofijotangible.nom_estatustecnico st on st.idestatustecnico = c.idestatustecnico
                  left JOIN mod_logpatrimonio.nom_materialesconstruccion m
                  on m.idmaterialesconstruccion = c.idtechode
                  left JOIN mod_logpatrimonio.nom_materialesconstruccion m1
                  on m1.idmaterialesconstruccion = c.idparedesde
                  left JOIN mod_logpatrimonio.nom_tipologia t on t.idtipologia = c.idtipologia
                  WHERE c.idregnumerico = {$parametros['idregnumerico']}";
        $datos[] = $conn->execute($sql3)->fetchAll(PDO::FETCH_ASSOC);

        $sql4 = "SELECT a.*, ov.denominacion as denomocupacionviv, vv.denominacion as denomvinculacionlaboral
                  FROM mod_logpatrimonio.dat_auxiliarlesvivienda a
                  left join mod_logpatrimonio.nom_ocupacionviv ov on ov.idocupacionviv = a.idocupacionviv
                  left join mod_logpatrimonio.nom_vinculacionlaboral vv on vv.idvinculacionlaboral = a.idvinculacionlaboral
                  WHERE a.idregnumerico = {$parametros['idregnumerico']}";
        $datos[] = $conn->execute($sql4)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarRegistrosSistemaEmp()
    {

    }

    public function cargarRegistrosIngenieria($parametros)
    {
        $datos[] = $this->getDatosIdentificacionIng($parametros['idregnumerico']);
        $datos[] = $this->getDatosObrasProtectorasIng($parametros['idregnumerico']);
        $datos[] = [];
        $datos[] = $this->getDatosGenDatosContables($parametros['idregnumerico']);
        return $datos;
    }

    public function getDatosIdentificacionIng($idregnumerico)
    {
        $query = new Doctrine_Query();
        $query->select('i.*,tobra.denominacion as denomTipoObra,tobra.idtipoobra as  idtipoobra,'
            . ' et.denominacion as denomEstatus,et.idestatustecnico as idestatustecnico,'
            . 'eo.denominacion as denomEstatusOperat,eo.idestatusoperativo as idestatusoperativo');

        $query->from('DatIdentificacionInmuebleIng i')
            ->leftJoin('i.NomEstatustecnico et')
            ->leftJoin('i.NomTipoObra tobra')
            ->leftJoin('i.NomEstatusoperativo eo');

        $query->where("i.idindentificacioninmuebleing = ?", $idregnumerico);
        return $query->fetchArray();
    }

    public function getDatosObrasProtectorasIng($idregnumerico)
    {

        $query = new Doctrine_Query();

        $query->select('op.*,d.denominacion as designacion,v.denominacion as ventilacion,se.denominacion as energetico,'
            . 'cc.denominacion as constructiva, cc.idconstructiva as idconstructiva,'
            . 'v.idventilacion as idventilacion,se.idenergetico as idenergetico,'
            . 'd.iddesignacion as iddesignacion');

        $query->from('DatObrasProtectorasInmuebleIng op')
            ->leftJoin('op.NomDesignacion d')
            ->leftJoin('op.NomTipoVentilacion v')
            ->leftJoin('op.NomSistemaEnergetico se')
            ->leftJoin('op.NomConstructiva cc');

        $query->where("op.idobrasing = ?", $idregnumerico);
        $datos = $query->fetchArray();

        $resul = self::getObrasProtectorasInmTipoComunicacion($idregnumerico);

        /* foreach ($resul as $res) {
          $arrayid[] = $res['idtipocomunicacion'];
          } */
        foreach ($resul as $index => $res) {
            if (count($resul) - 1 != $index) {
                $arrayid .= $res['idtipocomunicacion'] . ",";
            } else {
                $arrayid .= $res['idtipocomunicacion'];
            }
        }
        $datos[0]['idcomunicacion'] = $arrayid;

        return $datos;

        //   $query->limit(($parametros['limit']) ? $parametros['limit'] : 20)
        //    ->offset(($parametros['start']) ? $parametros['start'] : 0);
    }

    public function getDatosGenDatosContables($idregnumerico)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "select dg.*,et.denominacion, et.idestatustecnico as idestatustecnico";
        $sqlfrom = " FROM mod_logpatrimonio.dat_gendatoscontcamp dg
                    LEFT JOIN mod_logactivofijotangible.nom_estatustecnico et on 
                    et.idestatustecnico = dg.idestatustecnico ";
        $WHERE = " WHERE dg.idregnumerico = {$idregnumerico}";
        return $conn->execute($sql . $sqlfrom . $WHERE)->fetchAll(
            PDO::FETCH_ASSOC
        );
    }

    public function cargarRegistrosConstAloj($parametros)
    {
        $datos[] = $this->getDatosIdentificacionCamp($parametros['idregnumerico']);
        $datos[] = [];
        $datos[] = [];
        $datos[] = [];
        $datos[] = $this->getDatosGenDatosContables($parametros['idregnumerico']);

        /*  $mcuadrado = $this->obtenerObjetosObras(Zend_Json::decode(stripcslashes($parametros['idsaux'])));

          print_r();die;
          $datos[0][0]['area'] = $mcuadrado; */
        return $datos;
    }

    public function getDatosIdentificacionCamp($idregnumerico)
    {

        $conn = Zend_Registry::get('conexion');
        $sql = "select i.*";
        $sqlfrom = " FROM mod_logpatrimonio.dat_identificacioninmueblecamp i
                   -- INNER JOIN mod_persona.dat_persona p  ON(i.idresponsable = p.idpersona)
                    left JOIN  mod_datosmaestros.nom_dpt pro  ON(i.idprovincia = pro.iddpt)
                    left JOIN  mod_datosmaestros.nom_dpt mun  ON(i.idmunicipio = mun.iddpt)";

        $WHERE = " WHERE i.idindentificacioninmueble = {$idregnumerico}";
        $datos = $conn->execute($sql . $sqlfrom . $WHERE)->fetchAll(PDO::FETCH_ASSOC);
        if ($datos[0]['idprovincia']) {
            $datMunic = $this->getCargarMunicipios($datos[0]['idprovincia']);
        }

        foreach ($datMunic as $valor) {
            if ($valor['iddpt'] == $datos[0]['idmunicipio']) {
                $datos[0]['idmunicipio'] = $valor['denominacion'];
            }
        }
        return $datos;
    }

    public function eliminarDestinoLocal($parametros)
    {

        $query = new Doctrine_Query();
        $query->delete()
            ->from('DatDestinoLocalesCamp ct')
            ->where('ct.idregnumerico = ?', array($parametros['idregnumerico']))
            ->whereIn('ct.iddestinolocalinmcomp', $parametros['ids'])
            ->execute();
        return 1;
    }

    public function eliminarCaracTec($parametros)
    {

        $query = new Doctrine_Query();
        $query->delete()
            ->from('DatCaractTecnicaCamp ct')
            ->where('ct.idregnumerico = ?', array($parametros['idregnumerico']))
            ->whereIn('ct.idcaracteristicainmcamp', $parametros['ids'])
            ->execute();
        return 1;
    }

    public function guardarRegistroEspecialiadad($parametros)
    {
        $tabla = 'DatRegistroespecialidad';
        $datTabla = Doctrine::getTable($tabla)->find($parametros['idregnumerico']);

        if (!$datTabla) {
            $datRegistro = new $tabla();
            $datRegistro->denominacion = $parametros['cod_entidad'];
            $datRegistro->idregnumerico = $parametros['idregnumerico'];
            $datRegistro->save();
        }
    }

}
