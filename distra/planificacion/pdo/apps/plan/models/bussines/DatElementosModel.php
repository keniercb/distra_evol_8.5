<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatElementosModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatElementos $datElementos)
    {
        $datElementos->save();
    }

    public function Actualizar(DatElementos $datElementos)
    {
        $datElementos->save();
    }

    public function Eliminar($datElementos)
    {
        $datElementos->delete();
    }

    public function ObtenerElementosPorTipo($idusuario, $tipoelemento)
    {
        $cero = 0;
        $uno = 1;
        $cont = 0;
        $arrayinvolucrados[$cont]['idinvolucrado'] = $idusuario . $cero;
        $cont++;
        $arrayinvolucrados[$cont]['idinvolucrado'] = $idusuario . $uno;
        $cont++;
        $grupos
            = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $idusuario
        );
        if (isset($grupos[0])) {
            foreach ($grupos as $grup) {
                $arrayinvolucrados[$cont]['idinvolucrado']
                    = $grup['idgrupo'] . $cero;
                $cont++;
                $arrayinvolucrados[$cont]['idinvolucrado']
                    = $grup['idgrupo'] . $uno;
                $cont++;
            }
        }
        $arrayelementos = DatElementos::ObtenerElementos(
            $idusuario, $tipoelemento, $arrayinvolucrados
        );
        return $arrayelementos;
    }

    public function VerificarElementos(
        $idusuariocrea, $elementosunicos, $idtipoelemento
    ) {
        $fechainicio = null;
        $fechafin = null;
        $denominacion = null;
        $objeleminvol = new DatElementosDatInvolucradosModel();
        $arraidelementosparami = $objeleminvol->DameRelacionInvolPara(
            $idusuariocrea, $idtipoelemento, $fechainicio, $fechafin,
            $denominacion
        );
        $elementosunicos = $arraidelementosparami;
        return $elementosunicos;
    }

    public function VerificarArc($idusuariocrea, $arcunicos)
    {
        $objarcinvol = new DatArcDatInvolucradosModel();
        $arraidarcparami = $objarcinvol->DameRelacionInvolPara($idusuariocrea);
        $arcunicos = $arraidarcparami;
        $arrayarcpormi = DatArc::DameARCPorAutor($idusuariocrea);
        if ($arrayarcpormi) {
            foreach ($arrayarcpormi as $key => $arcpormi) {
                $arrayidarcpor[$key]['idelemento'] = $arcpormi['idarc'];
            }
            $objelementmodel = new DatElementosModel();
            $arcunicos = $objelementmodel->ObtenerArregloUnico(
                $arraidarcparami, $arrayidarcpor
            );
        }
        return $arcunicos;
    }

    public function CargarArbolRelacionesFip($idfip, $idusuariosession)
    {
        $arrayfip = $this->ObtenerFip($idusuariosession, $idfip);
        return $arrayfip;
    }

    public function ObtenerFip($idusuariosession, $idfip)
    {
        $cont = 0;
        if ($idfip == 'nodo1') {
            $elementosunicos = $this->VerificarElementos(
                $idusuariosession, $elementosunicos, $idtipoelemento = 2
            );
            if (isset($elementosunicos[0])) {
                foreach ($elementosunicos as $elemento) {
                    $idelementofip = $elemento['idelemento'];
                    $eshijo = DatElementosDatElementos::EsElementoHijo(
                        $idelementofip
                    );
                    if (!isset($eshijo[0])) {
                        $leaf = true;
                        $tienefiphijos = DatElementos:: EsElementoPadre(
                            $idelementofip
                        );
                        if (isset($tienefiphijos[0])) {
                            foreach ($tienefiphijos as $hijo) {
                                $leaf = $this->VerificarInvolucrado(
                                    $idusuariosession, $hijo['idelemento']
                                );
                                if ($idusuariosession == $hijo['idusuariocrea']
                                ) {
                                    $leaf = false;
                                }
                            }
                        }
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $elemento['idelemento']
                        );
                        $objfip = Doctrine::getTable('DatFip')->find(
                            $elemento['idelemento']
                        );
                        $superior = 0;
                        $icon = 'fip';
                        if ($objelemento->idusuariocrea != $idusuariosession) {
                            $superior = 1;
                            $icon = 'fipsuperior';
                        }
                        $arrayfip[$cont]['id']
                            = $idfip . $objelemento->idelemento;
                        $arrayfip[$cont]['idelemento']
                            = $objelemento->idelemento;
                        $arrayfip[$cont]['tipoelemento'] = 'FIP';
                        $arrayfip[$cont]['text'] = $objelemento->denelemento;
                        $arrayfip[$cont]['idautor']
                            = $objelemento->idusuariocrea;
                        $arrayfip[$cont]['nombreautor']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayfip[$cont]['draggable'] = false;
                        $arrayfip[$cont]['iconCls'] = $icon;
                        $arrayfip[$cont]['checked'] = false;
                        $arrayfip[$cont]['leaf'] = $leaf;
                        $arrayfip[$cont]['fechainicio'] = $objfip->fechaemision;
                        $arrayfip[$cont]['fechafin']
                            = $objfip->fechacumplimiento;
                        $arrayfip[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
            }
            return $arrayfip;
        }
        if ($idfip != 'nodo1') {
            $fiphijos = DatElementos:: EsElementoPadre($idfip);
            if (isset($fiphijos[0])) {
                foreach ($fiphijos as $fiphijo) {
                    $idfiphijo
                        = $fiphijo['DatElementosDatElementos']['idelementohijo'];
                    $invol = $this->VerificarInvolucrado(
                        $idusuariosession, $idfiphijo
                    );
                    if ($invol == true) {
                        $leaf = true;
                        $tienefiphijos = DatElementos:: EsElementoPadre(
                            $idfiphijo
                        );
                        if (isset($tienefiphijos[0])) {
                            foreach ($tienefiphijos as $hijo) {
                                $leaf = $this->VerificarInvolucrado(
                                    $idusuariosession, $hijo['idelemento']
                                );
                                if ($idusuariosession == $hijo['idusuariocrea']
                                ) {
                                    $leaf = false;
                                }
                            }
                        }
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idfiphijo
                        );
                        $objfip = Doctrine::getTable('DatFip')->find(
                            $idfiphijo
                        );
                        $superior = 0;
                        $icon = 'fip';
                        if ($objelemento->idusuariocrea != $idusuariosession) {
                            $superior = 1;
                            $icon = 'fipsuperior';
                        }
                        $arrayfip[$cont]['id']
                            = $idfip . $objelemento->idelemento;
                        $arrayfip[$cont]['idelemento']
                            = $objelemento->idelemento;
                        $arrayfip[$cont]['tipoelemento'] = 'FIP';
                        $arrayfip[$cont]['text'] = $objelemento->denelemento;
                        $arrayfip[$cont]['idautor']
                            = $objelemento->idusuariocrea;
                        $arrayfip[$cont]['nombreautor']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayfip[$cont]['draggable'] = false;
                        $arrayfip[$cont]['iconCls'] = $icon;
                        $arrayfip[$cont]['checked'] = false;
                        $arrayfip[$cont]['leaf'] = $leaf;
                        $arrayfip[$cont]['fechainicio'] = $objfip->fechaemision;
                        $arrayfip[$cont]['fechafin']
                            = $objfip->fechacumplimiento;
                        $arrayfip[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
            }
            return $arrayfip;
        }
    }

    public function CargarArbolRelacionesPlan($idplan, $idusuariosession)
    {
        $arrayplan = $this->ObtenerPlan($idusuariosession, $idplan);
        return $arrayplan;
    }

    public function ObtenerPlan($idusuariosession, $idplan)
    {
        $cont = 0;
        if ($idplan == 'nodo1') {
            $elementosunicos = $this->VerificarElementos(
                $idusuariosession, $elementosunicos, $idtipoelemento = 0
            );
            if (isset($elementosunicos[0])) {
                foreach ($elementosunicos as $elemento) {
                    $idelementoplan = $elemento['idelemento'];
                    $eshijo = DatElementosDatElementos::EsElementoHijo(
                        $idelementoplan
                    );
                    if (!isset($eshijo[0])) {
                        $leaf = true;
                        $tieneplaneshijos = DatElementos:: EsElementoPadre(
                            $idelementoplan
                        );
                        if (isset($tieneplaneshijos[0])) {
                            foreach ($tieneplaneshijos as $hijo) {
                                $leaf = $this->VerificarInvolucrado(
                                    $idusuariosession, $hijo['idelemento']
                                );
                                if ($idusuariosession == $hijo['idusuariocrea']
                                ) {
                                    $leaf = false;
                                }
                            }
                        }
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idelementoplan
                        );
                        $objplan = Doctrine::getTable('DatPlanPdo')->find(
                            $idelementoplan
                        );
                        $superior = 0;
                        $icon = 'plan';
                        if ($objelemento->idusuariocrea != $idusuariosession) {
                            $superior = 1;
                            $icon = 'planns';
                        }
                        $arrayplan[$cont]['id']
                            = $idplan . $objelemento->idelemento;
                        $arrayplan[$cont]['idelemento']
                            = $objelemento->idelemento;
                        $arrayplan[$cont]['tipoelemento'] = 'Plan';
                        $arrayplan[$cont]['text'] = $objelemento->denelemento;
                        $arrayplan[$cont]['idautor']
                            = $objelemento->idusuariocrea;
                        $arrayplan[$cont]['nombreautor']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayplan[$cont]['draggable'] = false;
                        $arrayplan[$cont]['iconCls'] = $icon;
                        $arrayplan[$cont]['checked'] = false;
                        $arrayplan[$cont]['leaf'] = $leaf;
                        $arrayplan[$cont]['fechainicio']
                            = $objplan->fechainicio;
                        $arrayplan[$cont]['fechafin'] = $objplan->fechafin;
                        $arrayplan[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
            }
            return $arrayplan;
        }
        if ($idplan != 'nodo1') {
            $planeshijos = DatElementos:: EsElementoPadre($idplan);
            if (isset($planeshijos[0])) {
                foreach ($planeshijos as $planhijo) {
                    $idplanhijo
                        = $planhijo['DatElementosDatElementos']['idelementohijo'];
                    $invol = $this->VerificarInvolucrado(
                        $idusuariosession, $idplanhijo
                    );
                    if ($invol == true) {
                        $leaf = true;
                        $tieneplaneshijos = DatElementos:: EsElementoPadre(
                            $idplanhijo
                        );
                        if (isset($tieneplaneshijos[0])) {
                            foreach ($tieneplaneshijos as $hijo) {
                                $leaf = $this->VerificarInvolucrado(
                                    $idusuariosession, $hijo['idelemento']
                                );
                                if ($idusuariosession == $hijo['idusuariocrea']
                                ) {
                                    $leaf = false;
                                }
                            }
                        }
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idelementoplan
                        );
                        $objplan = Doctrine::getTable('DatPlanPdo')->find(
                            $idelementoplan
                        );
                        $superior = 0;
                        $icon = 'plan';
                        if ($objelemento->idusuariocrea != $idusuariosession) {
                            $superior = 1;
                            $icon = 'planns';
                        }
                        $arrayplan[$cont]['id']
                            = $idplan . $objelemento->idelemento;
                        $arrayplan[$cont]['idelemento']
                            = $objelemento->idelemento;
                        $arrayplan[$cont]['tipoelemento'] = 'Plan';
                        $arrayplan[$cont]['text'] = $objelemento->denelemento;
                        $arrayplan[$cont]['idautor']
                            = $objelemento->idusuariocrea;
                        $arrayplan[$cont]['nombreautor']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayplan[$cont]['draggable'] = false;
                        $arrayplan[$cont]['iconCls'] = $icon;
                        $arrayplan[$cont]['checked'] = false;
                        $arrayplan[$cont]['leaf'] = $leaf;
                        $arrayplan[$cont]['fechainicio']
                            = $objplan->fechainicio;
                        $arrayplan[$cont]['fechafin'] = $objplan->fechafin;
                        $arrayplan[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
            }
            return $arrayplan;
        }
    }

    public function CargarArbolRelacionesObj($idelemento, $idusuariosession)
    {
        $arrayplan = $this->ObtenerObjetivos($idusuariosession, $idelemento);
        return $arrayplan;
    }

    public function ObtenerObjetivos($idusuariosession, $idelemento)
    {
        $cont = 0;
        if ($idelemento == 'nodo1') {
            //$arrayobjetivos = $this->ObtenerElementosPorTipo(
            //$idusuario,$tipoelemento = 1);
            $elementosunicos = $this->VerificarElementos(
                $idusuariosession, $elementosunicos, $idtipoelemento = 1
            );
            if (isset($elementosunicos[0])) {
                foreach ($elementosunicos as $elemento) {
                    $idelementoobj = $elemento['idelemento'];
                    $eshijo = DatElementosDatElementos::EsElementoHijo(
                        $idelementoobj
                    );
                    if (!isset($eshijo[0])) {
                        $leaf = true;
                        $tieneobjetivoshijos = DatElementos:: EsElementoPadre(
                            $idelementoobj
                        );
                        if (isset($tieneobjetivoshijos[0])) {
                            foreach ($tieneobjetivoshijos as $hijo) {
                                $leaf = $this->VerificarInvolucrado(
                                    $idusuariosession, $hijo['idelemento']
                                );
                                if ($idusuariosession == $hijo['idusuariocrea']
                                ) {
                                    $leaf = false;
                                }
                            }
                        }
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idelementoobj
                        );
                        $objobjetivo = Doctrine::getTable('DatObjetivo')->find(
                            $idelementoobj
                        );
                        $superior = 0;
                        $icon = 'objetivo';
                        if ($objelemento->idusuariocrea != $idusuariosession) {
                            $superior = 1;
                            $icon = 'objetivons';
                        }
                        $arrayobjetivo[$cont]['id']
                            = $idelemento . $objelemento->idelemento;
                        $arrayobjetivo[$cont]['idelemento']
                            = $objelemento->idelemento;
                        $arrayobjetivo[$cont]['tipoelemento'] = 'Objetivo';
                        $arrayobjetivo[$cont]['text']
                            = $objelemento->denelemento;
                        $arrayobjetivo[$cont]['idautor']
                            = $objelemento->idusuariocrea;
                        $arrayobjetivo[$cont]['nombreautor']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayobjetivo[$cont]['draggable'] = false;
                        $arrayobjetivo[$cont]['iconCls'] = $icon;
                        $arrayobjetivo[$cont]['checked'] = false;
                        $arrayobjetivo[$cont]['leaf'] = $leaf;
                        $arrayobjetivo[$cont]['fechainicio']
                            = $objobjetivo->fechainicio;
                        $arrayobjetivo[$cont]['fechafin']
                            = $objobjetivo->fechafin;
                        $arrayobjetivo[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
            }
            return $arrayobjetivo;
        }
        if ($idelemento != 'nodo1') {
            $objetivoshijos = DatElementos:: EsElementoPadre($idelemento);
            if (isset($objetivoshijos[0])) {
                foreach ($objetivoshijos as $objhijo) {
                    $idobjhijo
                        = $objhijo['DatElementosDatElementos']['idelementohijo'];
                    $invol = $this->VerificarInvolucrado(
                        $idusuariosession, $idobjhijo
                    );
                    if ($invol == true) {
                        $leaf = true;
                        $tieneobjetivoshijos = DatElementos:: EsElementoPadre(
                            $idobjhijo
                        );
                        if (isset($tieneobjetivoshijos[0])) {
                            foreach ($tieneobjetivoshijos as $hijo) {
                                $leaf = $this->VerificarInvolucrado(
                                    $idusuariosession, $hijo['idelemento']
                                );
                                if ($idusuariosession == $hijo['idusuariocrea']
                                ) {
                                    $leaf = false;
                                }
                            }
                        }
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idobjhijo
                        );
                        $objobjetivo = Doctrine::getTable('DatObjetivo')->find(
                            $idobjhijo
                        );
                        $superior = 0;
                        $icon = 'objetivo';
                        if ($objelemento->idusuariocrea != $idusuariosession) {
                            $superior = 1;
                            $icon = 'objetivons';
                        }
                        $arrayobjetivo[$cont]['id']
                            = $idelemento . $objelemento->idelemento;
                        $arrayobjetivo[$cont]['idelemento']
                            = $objelemento->idelemento;
                        $arrayobjetivo[$cont]['tipoelemento'] = 'Objetivo';
                        $arrayobjetivo[$cont]['text']
                            = $objelemento->denelemento;
                        $arrayobjetivo[$cont]['idautor']
                            = $objelemento->idusuariocrea;
                        $arrayobjetivo[$cont]['nombreautor']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayobjetivo[$cont]['draggable'] = false;
                        $arrayobjetivo[$cont]['iconCls'] = $icon;
                        $arrayobjetivo[$cont]['checked'] = false;
                        $arrayobjetivo[$cont]['leaf'] = $leaf;
                        $arrayobjetivo[$cont]['fechainicio']
                            = $objobjetivo->fechainicio;
                        $arrayobjetivo[$cont]['fechafin']
                            = $objobjetivo->fechafin;
                        $arrayobjetivo[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
            }
            return $arrayobjetivo;
        }
    }

    public function CargarArbolRelacionesARC($idarc, $idusuariosession)
    {
        $arrayarc = $this->ObtenerARC($idusuariosession, $idarc);
        return $arrayarc;
    }

    public function ObtenerARC($idusuariosession, $idarc)
    {
        $cont = 0;
        if ($idarc == 'nodo1') {
            $arcunicos = $this->VerificarArc($idusuariosession, $arcunicos);
            if ($arcunicos) {
                foreach ($arcunicos as $arc) {
                    $idarc = $arc['idelemento'];
                    $objarc = Doctrine::getTable('DatArc')->find($idarc);
                    if ($objarc->idarcp == $idarc) {
                        $leaf = true;
                        $tienehijos = DatArc::GetHijas($idarc);
                        if ($tienehijos) {
                            foreach ($tienehijos as $hijo) {
                                $leaf = $this->VerificarInvolucradoArc(
                                    $idusuariosession, $hijo['idarc']
                                );
                                if ($idusuariosession == $hijo['idusuariocrea']
                                ) {
                                    $leaf = false;
                                }
                            }
                        }
                        $superior = 0;
                        if ($objarc->idusuariocrea != $idusuariosession) {
                            $superior = 1;
                        }
                        $arrayarc[$cont]['id'] = $idarc . $objarc->idarc;
                        $arrayarc[$cont]['idelemento'] = $objarc->idarc;
                        $arrayarc[$cont]['tipoelemento'] = 'ARC';
                        $arrayarc[$cont]['text'] = $objarc->denarc;
                        $arrayarc[$cont]['idautor'] = $objarc->idusuariocrea;
                        $arrayarc[$cont]['nombreautor']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objarc->idusuariocrea
                        );
                        $arrayarc[$cont]['draggable'] = false;
                        $arrayarc[$cont]['iconCls'] = 'arc';
                        $arrayarc[$cont]['checked'] = false;
                        $arrayarc[$cont]['leaf'] = $leaf;
                        $arrayarc[$cont]['fechainicio'] = $objarc->fechainicio;
                        $arrayarc[$cont]['fechafin'] = $objarc->fechafin;
                        $cont++;
                    }
                }
            }
            return $arrayarc;
        }
        if ($idarc != 'nodo1') {
            $archijos = DatArc::GetHijas($idarc);
            if ($archijos) {
                foreach ($archijos as $archijo) {
                    $idarchijo = $archijo['idarc'];
                    $invol = $this->VerificarInvolucradoArc(
                        $idusuariosession, $idarchijo
                    );
                    if ($invol == true) {
                        $leaf = true;
                        $tienearchijos = DatArc:: GetHijas($idarchijo);
                        if ($tienearchijos) {
                            foreach ($tienearchijos as $hijo) {
                                $leaf = $this->VerificarInvolucradoArc(
                                    $idusuariosession, $hijo['idarc']
                                );
                                if ($idusuariosession == $hijo['idusuariocrea']
                                ) {
                                    $leaf = false;
                                }
                            }
                        }
                        $objarc = Doctrine::getTable('DatArc')->find(
                            $idarchijo
                        );
                        $superior = 0;
                        if ($objelemento->idusuariocrea != $idusuariosession) {
                            $superior = 1;
                        }
                        $arrayarc[$cont]['id'] = $idarc . $objarc->idarc;
                        $arrayarc[$cont]['idelemento'] = $objarc->idarc;
                        $arrayarc[$cont]['tipoelemento'] = 'ARC';
                        $arrayarc[$cont]['text'] = $objarc->denarc;
                        $arrayarc[$cont]['idautor'] = $objarc->idusuariocrea;
                        $arrayarc[$cont]['nombreautor']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objarc->idusuariocrea
                        );
                        $arrayarc[$cont]['draggable'] = false;
                        $arrayarc[$cont]['iconCls'] = 'arc';
                        $arrayarc[$cont]['checked'] = false;
                        $arrayarc[$cont]['leaf'] = $leaf;
                        $arrayarc[$cont]['fechainicio'] = $objarc->fechainicio;
                        $arrayarc[$cont]['fechafin'] = $objarc->fechafin;
                        $cont++;
                    }
                }
            }
            return $arrayarc;
        }
    }

    public function CargarActividadesCalendario(
        $idusuariosession, $arrayinvolucrados, $arrayarrayautores, $fechainicio,
        $fechafin, $arraynomencladores, $certificado, $iddominio, $arrayestados,
        $arrayplanes
    ) {
        $arrayactividades = DatElementos::DameActivdiadesCalendario(
            $fechainicio, $fechafin, $arrayinvolucrados, $arrayarrayautores,
            $arraynomencladores, $arrayestados, $arrayplanes
        );
        $contact = 0;
        if (isset($arrayactividades[0])) {
            $arrayactcalendario = array();
            foreach ($arrayactividades as $actividad) {
                $colorcategoria = '';
                $nomactegoriaact
                    = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
                    $actividad['idelemento'], $tiponomenclador = 2
                );
                $color
                    = $this->pIntegrator->configuracionpdo->DameColorCategoriaActividad(
                    $nomactegoriaact[0]['idnomenclador']
                );
                if ($color) {
                    $colorcategoria = "#" . $color;
                }
                $objnomcategact = Doctrine::getTable('NomNomenclador')->find(
                    $nomactegoriaact[0]['idnomenclador']
                );
                $nomtipoact
                    = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
                    $actividad['idelemento'], $tiponomenclador = 3
                );
                $objnomtipoact = Doctrine::getTable('NomNomenclador')->find(
                    $nomtipoact[0]['idnomenclador']
                );
                $nomestadocump
                    = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
                    $actividad['idelemento'], $tiponomenclador = 6
                );
                $objnomestadocump = Doctrine::getTable('NomNomenclador')->find(
                    $nomestadocump[0]['idnomenclador']
                );
                $fechainicio = explode('-', $actividad['fechainicio']);
                $fechafin = explode('-', $actividad['fechafin']);
                $startdatelegible
                    = $fechainicio[1] . '/' . $fechainicio[2] . '/'
                    . $fechainicio[0];
                $enddatelegible
                    = $fechafin[1] . '/' . $fechafin[2] . '/' . $fechafin[0];
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                if ($actividad['idusuariocrea'] != $idusuariosession
                ) {//if($actividad['idusuariocrea'] != $idusuariosession)
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuariosession, $actividad['idusuariocrea'],
                        $certificado, $iddominio
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                    }
                }
                $arrayactcalendario[$contact]['id'] = $actividad['idelemento'];
                $arrayactcalendario[$contact]['subject']
                    = $actividad['denelemento'];
                $arrayactcalendario[$contact]['description']
                    = $actividad['descelemento'];
                $arrayactcalendario[$contact]['startdate']
                    = $startdatelegible . ' ' . $actividad['horainicio'];
                $arrayactcalendario[$contact]['enddate']
                    = $enddatelegible . ' ' . $actividad['horafin'];
                $arrayactcalendario[$contact]['color'] = $colorcategoria;
                $arrayactcalendario[$contact]['idelemento']
                    = $actividad['idelemento'];
                $arrayactcalendario[$contact]['categoria']
                    = $objnomcategact->dennomenclador;
                $arrayactcalendario[$contact]['tipoact']
                    = $objnomtipoact->dennomenclador;
                $arrayactcalendario[$contact]['lugar'] = $actividad['lugar'];
                $arrayactcalendario[$contact]['participan']
                    = $actividad['participante'];
                $arrayactcalendario[$contact]['modificar'] = $modificar;
                $arrayactcalendario[$contact]['eliminar'] = $eliminar;
                $arrayactcalendario[$contact]['activo'] = $actividad['activo'];
                $arrayactcalendario[$contact]['estadocump']
                    = $objnomestadocump->dennomenclador;
                $arrayactcalendario[$contact]['gradocump']
                    = $actividad['gradocumplimiento'];
                $arrayactcalendario[$contact]['superior'] = $superior;
                $arrayactcalendario[$contact]['idautor']
                    = $actividad['idusuariocrea'];
                $contact++;
            }
        }
        return $arrayactcalendario;
    }

    public function DameFechaLegible($fechainicio, $fechafin)
    {
        $fechainicio = explode('-', $fechainicio);
        $fechainicio
            = $fechainicio[1] . '/' . $fechainicio[2] . '/' . $fechainicio[0];
        $fechafin = explode('-', $fechafin);
        $fechafin = $fechafin[1] . '/' . $fechafin[2] . '/' . $fechafin[0];
        $arrayfechas['fechainicio'] = $fechainicio;
        $arrayfechas['fechafin'] = $fechafin;
        return $arrayfechas;
    }

    public function DameNumFechaVariable($fechainicio, $fechafin)
    {
        $fechainicio = explode('-', $fechainicio);
        $fechainicio = implode($fechainicio);
        $fechafin = explode('-', $fechafin);
        $fechafin = implode($fechafin);
        $arrayfechas['fechainicio'] = $fechainicio;
        $arrayfechas['fechafin'] = $fechafin;
        return $arrayfechas;
    }

    public function DameNumFecha($fechainicio, $fechafin)
    {
        $fechainicio = explode('/', $fechainicio);
        krsort($fechainicio);
        $fechainicio = implode($fechainicio);
        $fechafin = explode('/', $fechafin);
        krsort($fechafin);
        $fechafin = implode($fechafin);
        $arrayfechas['fechainicio'] = $fechainicio;
        $arrayfechas['fechafin'] = $fechafin;
        return $arrayfechas;
    }

    public function DimeSiEstaEnRango(
        $arraynumfechasvariable, $arraynumfechasbusqueda
    ) {
        $numerofechainiciovariable = $arraynumfechasvariable['fechainicio'];
        $numerofechafinvariable = $arraynumfechasvariable['fechafin'];
        $numerofechainiciobusqueda = $arraynumfechasbusqueda['fechainicio'];
        $numerofechafinbusqueda = $arraynumfechasbusqueda['fechafin'];
        $result = 0;
        if (($numerofechainiciovariable >= $numerofechainiciobusqueda)) {
            $result = 1;
        }
        if ($numerofechafinvariable >= $numerofechainiciobusqueda
            && $numerofechafinvariable <= $numerofechafinbusqueda
        ) {
            $result = 1;
        }
        if ($numerofechainiciovariable <= $numerofechainiciobusqueda
            && $numerofechafinvariable >= $numerofechafinbusqueda
        ) {
            $result = 1;
        }
        return $result;
    }

    public function DameArrayIdActParaUsuario($idusuariocrea)
    {
        $objeleminvol = new DatElementosDatInvolucradosModel();
        $arrayidactividadesparami = $objeleminvol->DameRelacionInvolPara(
            $idusuariocrea, $idtipoelemento = 3
        );
        return $arrayidactividadesparami;
    }

    public function DameArrayIdActPorInvolucrado(
        $arrayidactividades, $arrayinvolucrados
    ) {
        $objeleminvol = new DatElementosDatInvolucradosModel();

        foreach ($arrayinvolucrados as $involucrado) {
            $tipo = $involucrado->tipo;
            if ($tipo == 0) {
                $idgrupo = $involucrado->idgrupo;
                $arrausuarios
                    = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                    $idgrupo
                );
                if ($arrausuarios) {
                    foreach ($arrausuarios as $usuario) {
                        $idusuario = $usuario['idusuario'];
                        $arrayidact = $objeleminvol->DameRelacionInvolPara(
                            $idusuario
                        );
                        $arrayidactividades
                            = $objelementmodel->ObtenerArregloUnico(
                            $arrayidactividades, $arrayidact
                        );
                    }
                }
            }
            if ($tipo == 1) {
                $idusuario = $involucrado->idusuario;
                $arrayidact = $objeleminvol->DameRelacionInvolPara($idusuario);
                $arrayidactividades = $objelementmodel->ObtenerArregloUnico(
                    $arrayidactividades, $arrayidact
                );
            }
        }
        return $arrayidactividades;
    }

    public function DameArrayIdActPorCateg(
        $arrayidactividades, $arraycategoriasact
    ) {
        $cont = 0;
        foreach ($arraycategoriasact as $categact) {
            $idcategoria = $categact->idcategoria;
            $elementos
                = DatElementosNomNomenclador::DameRelacionElemNomPorIdNom(
                $idcategoria
            );
            if ($elementos) {
                foreach ($elementos as $elemento) {
                    $arrayidactcateg[$cont]['id'] = $elemento['idelemento'];
                    $cont++;
                }
            }
            $arraycategoriashijas
                = $this->pIntegrator->configuracionpdo->DameCategoriasHijas(
                $idcategoria
            );
            if ($arraycategoriashijas) {
                foreach ($arraycategoriashijas as $categoriahija) {
                    $idcategoria = $categoriahija['idnomenclador'];
                    $elementos
                        = DatElementosNomNomenclador::DameRelacionElemNomPorIdNom(
                        $idcategoria
                    );
                    if ($elementos) {
                        foreach ($elementos as $elemento) {
                            $arrayidactcateg[$cont]['idelemento']
                                = $elemento['idelemento'];
                            $cont++;
                        }
                    }
                }
            }
        }
        if (count($arrayidactcateg) > 0) {
            //$objeleminvol = new DatElementosDatInvolucradosModel();
            $arrayidactividades = $objelementmodel->ObtenerArregloUnico(
                $arrayidactividades, $arrayidactcateg
            );
        }
        return $arrayidactividades;
    }

    public function DameArrayIdActPorTipoAct($arrayidactividades, $arraytipoact)
    {
        $cont = 0;
        foreach ($arraytipoact as $tipoact) {
            $idtipoactividad = $tipoact->idtipoactividad;
            $elementos
                = DatElementosNomNomenclador::DameRelacionElemNomPorIdNom(
                $idtipoactividad
            );
            if ($elementos) {
                foreach ($elementos as $elemento) {
                    $arrayidacttipo[$cont]['id'] = $elemento['idelemento'];
                    $cont++;
                }
            }
            $arraycategoriashijas
                = $this->pIntegrator->configuracionpdo->DameCategoriasHijas(
                $idtipoactividad
            );
            if ($arraycategoriashijas) {
                foreach ($arraycategoriashijas as $categoriahija) {
                    $idtipoactividad = $categoriahija['idnomenclador'];
                    $elementos
                        = DatElementosNomNomenclador::DameRelacionElemNomPorIdNom(
                        $idtipoactividad
                    );
                    if ($elementos) {
                        foreach ($elementos as $elemento) {
                            $arrayidacttipo[$cont]['idelemento']
                                = $elemento['idelemento'];
                            $cont++;
                        }
                    }
                }
            }
        }
        if (count($arrayidacttipo) > 0) {
            //$objeleminvol = new DatElementosDatInvolucradosModel();
            $arrayidactividades = $objelementmodel->ObtenerArregloUnico(
                $arrayidactividades, $arrayidacttipo
            );
        }
        return $arrayidactividades;
    }

    public function DameArrayIdActPorAutor(
        $arrayidactividades, $arrayautoresact
    ) {
        $cont = 0;
        foreach ($arrayautoresact as $autoract) {
            $tipo = $autoract->tipo;
            if ($tipo == 0) {
                $idgrupo = $autoract->idgrupo;
                $arrausuarios
                    = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                    $idgrupo
                );
                if ($arrausuarios) {
                    foreach ($arrausuarios as $usuario) {
                        $idusuario = $usuario['idusuario'];
                        $arrayactividadesporautor
                            = DatElementos::DameElementosDadoIdusuariocreayTipo(
                            $idusuario, $idtipoelemento = 3
                        );
                        if ($arrayactividadesporautor) {
                            foreach (
                                $arrayactividadesporautor as $actividadporautor
                            ) {
                                $arrayidactautor[$cont]['id']
                                    = $actividadporautor['idelemento'];
                                $cont++;
                            }
                        }
                    }
                }
            }
            if ($tipo == 1) {
                $idusuario = $autoract->idusuario;
                $arrayactividadesporautor
                    = DatElementos::DameElementosDadoIdusuariocreayTipo(
                    $idusuario, $idtipoelemento = 3
                );
                if ($arrayactividadesporautor) {
                    foreach ($arrayactividadesporautor as $actividadporautor) {
                        $arrayidactautor[$cont]['idelemento']
                            = $actividadporautor['idelemento'];
                        $cont++;
                    }
                }
            }
        }
        if (count($arrayidactautor) > 0) {
            $arrayidactividades = $objelementmodel->ObtenerArregloUnico(
                $arrayidactividades, $arrayidactautor
            );
        }
        return $arrayidactividades;
    }

    public function ObtenerArregloUnico($arrayidentrante, $arrayidsaliente)
    { //PARAMI, PORMI
        $cont = 0;
        if ($arrayidentrante) {
            foreach ($arrayidentrante as $identrante) {
                $identra = $identrante['idelemento'];
                if (count($arrayidsaliente) > 0) {
                    $existe = 0;
                    $cont = count($arrayidsaliente);
                    foreach ($arrayidsaliente as $idsaliente) {
                        $idsale = $idsaliente['idelemento'];
                        if ($identra == $idsale) {
                            $existe = 1;
                        }
                    }
                    if ($existe == 0) {
                        $arrayidsaliente[$cont]['idelemento'] = $identra;
                        $cont++;
                    }
                }
                if (count($arrayidsaliente) == 0) {
                    $arrayidsaliente[$cont]['idelemento'] = $identra;
                    $cont++;
                }
            }
        }
        return $arrayidsaliente;
    }

    public function AdicionarRelaciones(
        $arrayrelaciones, $idelemento, $idusuariocrea
    ) {
        if (isset($arrayrelaciones[0])) {
            foreach ($arrayrelaciones as $relacion) {
                if (isset($relacion->idelemento)) {
                    if ($relacion->idarc != 0) {
                        $idactividad = $idelemento * 1;
                        $idplan = $relacion->idelemento;
                        $idarc = $relacion->idarc;
                        $existerelacionarcplan
                            = DatArcDatPlan::ObtenerRelacionPlanArc(
                            $idplan, $idarc
                        );
                        if (!isset($existerelacionarcplan[0]['idplan'])) {
                            $objarcplan = new DatArcDatPlan();
                            $objarcplan->idarc = $idarc;
                            $objarcplan->idplan = $idplan;
                            $objarcplan->save();
                        }
                        $objarcplanact = new DatArcDatPlanActividades();
                        $existerelacionarcpalnact
                            = $objarcplanact->ObtenerRelacionPlanArcAct(
                            $idplan, $idarc, $idactividad
                        );
                        if (!isset($existerelacionarcpalnact[0]['idplan'])) {

                            $objrelacion = new DatArcDatPlanActividades();
                            $objrelacion->idplan = $idplan;
                            $objrelacion->idarc = $idarc;
                            $objrelacion->idactividad = $idactividad;
                            $objrelacion->idautor = $idusuariocrea;
                            $objrelacion->save();
                        }
                    } else {
                        $idelementopadre = $relacion->idelemento;
                        $idelementohijo = $idelemento;
                        $idautor = $relacion->idautor;
                        $origen = 1;
                        if ($idautor != $idusuariocrea) {
                            $origen = 3;
                        }
                        $obj = DatElementosDatElementos::BuscarPadreHijo(
                            $idelementopadre, $idelementohijo
                        );
                        if (!isset($obj[0]['idelementopadre'])) {
                            $objrelacion = new DatElementosDatElementos();
                            $objrelacion->idelementopadre = $idelementopadre;
                            $objrelacion->idelementohijo = $idelementohijo;
                            $objrelacion->origen = $origen;
                            $objrelacion->idautor = $idusuariocrea;
                            $objrelacion->save();
                        }
                    }
                }
            }
        }
    }

    public function EliminarRelaciones(
        $idpadre, $idelemento, $idarc, $idplan, $idactividad
    ) {
        if (!$idarc) {
            $objrelacion = Doctrine::getTable('DatElementosDatElementos')
                ->findByDql(
                    "idelementopadre = $idpadre AND idelementohijo = $idelemento"
                );
            $objrelacion->delete();
        } else {
            $objrelacion = Doctrine::getTable('DatArcDatPlanActividades')
                ->findByDql(
                    "idarc = $idarc AND idplan = $idplan AND idactividad = $idactividad"
                );
            $objrelacion->delete();
        }
    }

    public function ObtenerAutores(
        $certificado, $iddominio, $idusuariosession, $idgrupo, $nombreusuario
    ) {
        switch ($idgrupo) {
            case 'nodo1':
                $datosusuariosession[0]['id'] = $idgrupo . $idusuariosession;
                $datosusuariosession[0]['idusuario'] = $idusuariosession;
                $datosusuariosession[0]['text'] = $nombreusuario;
                $datosusuariosession[0]['tipo'] = 1;
                $datosusuariosession[0]['iconCls'] = 'usuarioejecutor';
                $datosusuariosession[0]['draggable'] = false;
                $datosusuariosession[0]['checked'] = false;
                $datosusuariosession[0]['leaf'] = true;
                return $datosusuariosession;
                break;
            case 'nodo2':
                $subordinados
                    = $this->pIntegrator->configuracionpdo->DameSubordinados(
                    $certificado, $iddominio, $idusuariosession
                );
                if (isset($subordinados[0])) {
                    foreach ($subordinados as $key => $subordinado) {
                        $datossubordinados[$key]['id']
                            = $idgrupo . $subordinado['idusuario'];
                        $datossubordinados[$key]['idusuario']
                            = $subordinado['idusuario'];
                        $datossubordinados[$key]['text'] = $subordinado['text'];
                        $datossubordinados[$key]['tipo'] = 1;
                        $datossubordinados[$key]['iconCls'] = 'usuarioejecutor';
                        $datossubordinados[$key]['draggable'] = false;
                        $datossubordinados[$key]['checked'] = false;
                        $datossubordinados[$key]['leaf'] = true;
                    }
                }
                return $datossubordinados;
                break;
            case 'nodo3':
                $arraypermisosleer
                    = $this->pIntegrator->configuracionpdo->DamePermisosLeer(
                    $idusuariosession
                );
                if (isset($arraypermisosleer[0])) {
                    foreach ($arraypermisosleer as $key => $permisoleer) {
                        $permisosleer[$key]['id']
                            = $idgrupo . $permisoleer['idusuario'];
                        $permisosleer[$key]['idusuario']
                            = $permisoleer['idusuario'];
                        $permisosleer[$key]['text']
                            = $permisoleer['nombreusuario'];
                        $permisosleer[$key]['tipo'] = 1;
                        $permisosleer[$key]['iconCls'] = 'usuarioejecutor';
                        $permisosleer[$key]['draggable'] = false;
                        $permisosleer[$key]['checked'] = false;
                        $permisosleer[$key]['leaf'] = true;
                    }
                }
                return $permisosleer;
                break;
        }
    }

    public function ObtenerInvol(
        $certificado, $iddominio, $idusuariosession, $idgrupo, $nombreusuario
    ) {
        switch ($idgrupo) {
            case 'nodo1':
                $datosusuariosession[0]['id'] = $idgrupo . $idusuariosession;
                $datosusuariosession[0]['idusuario'] = $idusuariosession;
                $datosusuariosession[0]['text'] = $nombreusuario;
                $datosusuariosession[0]['tipo'] = 1;
                $datosusuariosession[0]['iconCls'] = 'usuarioejecutor';
                $datosusuariosession[0]['draggable'] = false;
                $datosusuariosession[0]['checked'] = false;
                $datosusuariosession[0]['leaf'] = true;
                return $datosusuariosession;
                break;
            case 'nodo2':
                $arraygrupos
                    = $this->pIntegrator->configuracionpdo->DameGruposCreadosPorMi(
                    $idusuariosession
                );
                if (isset($arraygrupos[0])) {
                    foreach ($arraygrupos as $key => $grupo) {
                        $leaf = true;
                        $tieneusuarios
                            = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                            $grupo['idgrupo']
                        );
                        if (isset($tieneusuarios[0])) {
                            $leaf = false;
                        }
                        $arraymisgrupos[$key]['id']
                            = $idgrupo . $grupo['idgrupo'];
                        $arraymisgrupos[$key]['idgrupo'] = $grupo['idgrupo'];
                        $arraymisgrupos[$key]['text'] = $grupo['dengrupo'];
                        $arraymisgrupos[$key]['tipo'] = 0;
                        $arraymisgrupos[$key]['iconCls'] = 'grupoejecutor';
                        $arraymisgrupos[$key]['draggable'] = false;
                        $arraymisgrupos[$key]['checked'] = false;
                        $arraymisgrupos[$key]['leaf'] = $leaf;
                    }
                }
                return $arraymisgrupos;
                break;
            case 'nodo3':
                $subordinados
                    = $this->pIntegrator->configuracionpdo->DameSubordinados(
                    $certificado, $iddominio, $idusuariosession
                );
                if (isset($subordinados[0])) {
                    foreach ($subordinados as $key => $subordinado) {
                        $datossubordinados[$key]['id']
                            = $idgrupo . $subordinado['idusuario'];
                        $datossubordinados[$key]['idusuario']
                            = $subordinado['idusuario'];
                        $datossubordinados[$key]['text'] = $subordinado['text'];
                        $datossubordinados[$key]['tipo'] = 1;
                        $datossubordinados[$key]['iconCls'] = 'usuarioejecutor';
                        $datossubordinados[$key]['draggable'] = false;
                        $datossubordinados[$key]['checked'] = false;
                        $datossubordinados[$key]['leaf'] = true;
                    }
                }
                return $datossubordinados;
                break;
            default:
                $tieneusuarios
                    = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                    $idgrupo
                );
                if (isset($tieneusuarios[0])) {
                    foreach ($tieneusuarios as $key => $usuario) {
                        $arrayusers[$key]['id']
                            = $idgrupo . $usuario['idusuario'];
                        $arrayusers[$key]['idusuario'] = $usuario['idusuario'];
                        $arrayusers[$key]['text'] = $usuario['alias'];
                        $arrayusers[$key]['tipo'] = 1;
                        $arrayusers[$key]['iconCls'] = 'usuarioejecutor';
                        $arrayusers[$key]['draggable'] = false;
                        $arrayusers[$key]['leaf'] = true;
                    }
                }
                return $arrayusers;
        }
    }

    public function VerificarInvolucrado($idusuario, $idelemento)
    {
        $esinvol = false;
        $cero = 0;
        $uno = 1;
        $idinvolresp = $idusuario . $cero;
        $idinvolejec = $idusuario . $uno;
        $esinvolucradoenfipresp
            = DatElementosDatInvolucrados::ExisteInvolucrado(
            $idinvolresp, $idelemento
        );
        if ($esinvolucradoenfipresp) {
            $esinvol = true;
        }
        $esinvolucradoenfipejec
            = DatElementosDatInvolucrados::ExisteInvolucrado(
            $idinvolejec, $idelemento
        );
        if ($esinvolucradoenfipejec) {
            $esinvol = true;
        }
        $arraygrupos
            = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $idusuario
        );
        if ($arraygrupos) {
            foreach ($arraygrupos as $grupo) {
                $idgrupo = $grupo['idgrupo'];
                $idinvolresp = $idgrupo . $cero;
                $idinvolejec = $idgrupo . $uno;
                $esinvolucradoenfipresp
                    = DatElementosDatInvolucrados::ExisteInvolucrado(
                    $idinvolresp, $idelemento
                );
                if ($esinvolucradoenfipresp) {
                    $esinvol = true;
                }
                $esinvolucradoenfipejec
                    = DatElementosDatInvolucrados::ExisteInvolucrado(
                    $idinvolejec, $idelemento
                );
                if ($esinvolucradoenfipejec) {
                    $esinvol = true;
                }
            }
        }
        return $esinvol;
    }

    public function VerificarInvolucradoArc($idusuario, $idarc)
    {
        $esinvol = false;
        $cero = 0;
        $uno = 1;
        $idinvolresp = $idusuario . $cero;
        $idinvolejec = $idusuario . $uno;
        $esinvolucradoenarcresp = DatArcDatInvolucrados::ExisteElemento(
            $idarc, $idinvolresp
        );
        if ($esinvolucradoenarcresp) {
            $esinvol = true;
        }
        $esinvolucradoenarcejec = DatArcDatInvolucrados::ExisteElemento(
            $idarc, $idinvolejec
        );
        if ($esinvolucradoenarcejec) {
            $esinvol = true;
        }
        $arraygrupos
            = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $idusuario
        );
        if ($arraygrupos) {
            foreach ($arraygrupos as $grupo) {
                $idgrupo = $grupo['idgrupo'];
                $idinvolresp = $idgrupo . $cero;
                $idinvolejec = $idgrupo . $uno;
                $esinvolucradoenarcresp = DatArcDatInvolucrados::ExisteElemento(
                    $idarc, $idinvolresp
                );
                if ($esinvolucradoenarcresp) {
                    $esinvol = true;
                }
                $esinvolucradoenarcejec = DatArcDatInvolucrados::ExisteElemento(
                    $idarc, $idinvolejec
                );
                if ($esinvolucradoenarcejec) {
                    $esinvol = true;
                }
            }
        }
        return $esinvol;
    }

    public function ObtenerPosiblesInstancias(
        $actividad, $contact, $arrayactcalendario
    ) {
        $fechainicio = explode('-', $actividad['fechainicio']);
        $fechafin = explode('-', $actividad['fechafin']);
        $diasdiferencia = $this->RestarFechas($fechainicio, $fechafin);
        $incremento = 0;
        while ($incremento <= $diasdiferencia) {
            if ($incremento == 0) {
                $startdatelegible
                    = $fechainicio[1] . '/' . $fechainicio[2] . '/'
                    . $fechainicio[0];
                $enddatelegible = $fechainicio[1] . '/' . $fechainicio[2] . '/'
                    . $fechainicio[0];
            }
            if ($incremento > 0) {
                $dia = $fechainicio[2] + $incremento;
                $startdatelegible
                    = $fechainicio[1] . '/' . $dia . '/' . $fechainicio[0];
                $enddatelegible
                    = $fechainicio[1] . '/' . $dia . '/' . $fechainicio[0];
                $contact++;
            }
            return $arrayactcalendario;
        }
    }

    public function CalcularTotalDiasMes($anno, $mes)
    {
        if ($mes == 1 || $mes == 3 || $mes == 5 || $mes == 7 || $mes == 8
            || $mes == 10
            || $mes == 12
        ) {
            $totaldiasmes = 31;
        }
        if ($mes == 2) {
            $totaldiasmes = 28;
            if ($anno % 4 == 0 && ($anno % 100 != 0 || $anno % 400 == 0)) {
                $totaldiasmes = 29;
            }
        }
        if ($mes == 4 || $mes == 6 || $mes == 9 || $mes == 11) {
            $totaldiasmes = 30;
        }
        return $totaldiasmes;
    }

    public function RestarFechas($fechainicio, $fechafin)
    {
        $numfechainicio = mktime(
            0, 0, 0, $fechainicio[1], $fechainicio[2], $fechainicio[0]
        );
        $numfechafin = mktime(
            0, 0, 0, $fechafin[1], $fechafin[2], $fechafin[0]
        );
        $diasdiferencia = round(
            ($numfechafin - $numfechainicio) / (60 * 60 * 24)
        );
        return $diasdiferencia;
    }

    public function actualizarEstadoCumplimiento(
        $estadocumplimiento, $porciento
    ) {
        if ($porciento == 0) {
            $estadocumplimiento = "Sin cumplir";
        }
        if ($porciento > 0 && $porciento < 95) {
            $estadocumplimiento = "Parcialmente cumplido";
        }
        if ($porciento >= 95 && $porciento <= 100) {
            $estadocumplimiento = "Cumplida";
        }
        return $estadocumplimiento;
    }

    public function ObtenerEstadosAModificarDoc(
        $idsubsistema, $idusuario, $idtipodocumento, $idestadoinicial
    ) {
        $arrayestados = $this->pIntegrator->workflow->EstadosModDoc(
            $idsubsistema, $idusuario, $idtipodocumento, $idestadoinicial
        );
        if (isset($arrayestados[0])) {
            foreach (
                $arrayestados as /*$key =>*/
                $estado
            ) {
                if ($estado->idestado != $idestadoinicial) {
                    $dat->data [] = array('text' => $estado->denominacion,
                                          'id'   => $estado->idestado);
                }
            }
        }
        return $dat;
    }

    public function ObtenerEstadoAprobPorDefecto(
        $idsubsistema, $idusuario, $idtipodocumento
    ) {
        $arrayestadoinicial = $this->pIntegrator->workflow->EstadoPorDefecto(
            $idsubsistema, $idusuario, $idtipodocumento
        );
        if (isset($arrayestadoinicial[0])) {
            $idestadoaprobpordefecto = $arrayestadoinicial[0]->idestado;
        } else {
            $idestadoaprobpordefecto = null;
        }
        return $idestadoaprobpordefecto;
    }

    public function CambiarEstadoAprobacion(
        $idelem, $idusuariosession, $idestadoinicial, $idestadofinal,
        $idtipodoc, $obj, $idsubsistema
    ) {
        $respuesta = $this->pIntegrator->workflow->Ejecutar(
            $idusuariosession, $idestadoinicial, $idestadofinal, $idtipodoc,
            $obj, $idsubsistema
        );
        if ($respuesta['tipo'] == 1) {
            $this->ActualizarEstadoAElemento($idelem, $idestadofinal);
            $objelemento = Doctrine::getTable('DatElementos')->find($idelem);
            if ($objelemento->idelemento) {
                if ($objelemento->idtipoelemento != 3) {
                    $arrayelementos = array();
                    $arrayelementos = $this->ObtenerArregloDeDependencias(
                        $objelemento, $arrayelementos
                    );
                    if (isset($arrayelementos['plan_arc'][0])) {
                        foreach (
                            $arrayelementos['plan_arc'] as /*$keyarc =>*/
                            $arc
                        ) {
                            $arrayobjetivos = $arc['objetivos'];
                            if (isset($arrayobjetivos[0])) {
                                foreach (
                                    $arrayobjetivos as /*$keyobj =>*/
                                    $objetivo
                                ) {

                                    $respuesta
                                        = $this->pIntegrator->workflow->Ejecutar(
                                        $idusuariosession,
                                        $objetivo['idestadoaprob'],
                                        $idestadofinal, $idtipodoc = 1, $obj,
                                        $idsubsistema
                                    );
                                    if ($respuesta['tipo'] == 1) {
                                        $this->ActualizarEstadoAElemento(
                                            $objetivo['idelemento'],
                                            $idestadofinal
                                        );
                                        $arrayactividades
                                            = $objetivo['actividades'];
                                        if (isset($arrayactividades[0])) {
                                            foreach (
                                                $arrayactividades as $keyact =>
                                                $actividad
                                            ) {
                                                $respuesta
                                                    = $this->pIntegrator->workflow->Ejecutar(
                                                    $idusuariosession,
                                                    $actividad['idestadoaprob'],
                                                    $idestadofinal,
                                                    $idtipodoc = 3, $obj,
                                                    $idsubsistema
                                                );
                                                if ($respuesta['tipo'] == 1) {
                                                    $this->ActualizarEstadoAElemento(
                                                        $actividad['idelemento'],
                                                        $idestadofinal
                                                    );
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            $arrayactividades = $arc['actividades'];
                            if (isset($arrayactividades[0])) {
                                foreach (
                                    $arrayactividades as $keyact => $actividad
                                ) {
                                    $respuesta
                                        = $this->pIntegrator->workflow->Ejecutar(
                                        $idusuariosession,
                                        $actividad['idestadoaprob'],
                                        $idestadofinal, $idtipodoc = 3, $obj,
                                        $idsubsistema
                                    );
                                    if ($respuesta['tipo'] == 1) {
                                        $this->ActualizarEstadoAElemento(
                                            $actividad['idelemento'],
                                            $idestadofinal
                                        );
                                    }
                                }
                            }
                        }
                    }
                    if (isset($arrayelementos['plan_activ'][0])) {
                        $arrayactividades = $arrayelementos['plan_activ'];
                        foreach (
                            $arrayactividades as /* $keyarcact =>*/
                            $actividad
                        ) {
                            $respuesta = $this->pIntegrator->workflow->Ejecutar(
                                $idusuariosession, $actividad['idestadoaprob'],
                                $idestadofinal, $idtipodoc = 3, $obj,
                                $idsubsistema
                            );
                            if ($respuesta['tipo'] == 1) {
                                $this->ActualizarEstadoAElemento(
                                    $actividad['idelemento'], $idestadofinal
                                );
                            }
                        }
                    }
                }
                if ($objelemento->idtipoelemento == 3) {
                    /*$result = */
                    DatElementos::ActualizarEstadoAprobacionActRep(
                        $idestadofinal, $objelemento->idelemento
                    );
                }
            }
        }
        return $respuesta;
    }

    public function ObtenerArregloDeDependencias($objelemento, $arrayelementos)
    {
        switch ($objelemento->idtipoelemento) {
            case 0:
                //primero pido las areas relacionadas con el plan
                $arrayareasdelplan = DatArcDatPlan::ObtenerAreasPorPlanes(
                    $objelemento->idelemento
                );
                $arrayelementos['plan_arc'] = $arrayareasdelplan;
                if (isset($arrayareasdelplan[0])) {
                    foreach ($arrayareasdelplan as $key => $arc) {
                        //pido las actividades que cuelgan al plan mediante areas
                        $arrayelementos['plan_arc'][$key]['actividades']
                            = DatArcDatPlanActividades::ObtenerRelacionPlanArcActByPlanArc(
                            $objelemento->idelemento, $arc['idarc'],
                            $objelemento->idusuariocrea
                        );
                        //pido los objetivos que cuelgan del plan medinate areas
                        $arrayobjArcPlan
                            = DatArcDatPlanObjetivo::ObtenerRelacionObjetivoArcActByPlanArc(
                            $objelemento->idelemento, $arc['idarc'],
                            $objelemento->idusuariocrea
                        );
                        $arrayelementos['plan_arc'][$key]['objetivos']
                            = $arrayobjArcPlan;
                        if (isset($arrayobjArcPlan[0])) {
                            foreach ($arrayobjArcPlan as $pos => $objetivo) {
                                //pido los criterios que cuelgan del objetivo
                                $arrayelementos['plan_arc'][$key]['objetivos'][$pos]['citerios']
                                    = DatCriteriomedida::ObtenerCriteriosByOvjetivo(
                                    $objetivo['idelemento']
                                );
                                $arrayidtipoelemento[0]['idtipoelemento'] = 1;
                                $arrayorigen[0]['origen'] = 3;
                                $arrayorigen[1]['origen'] = 1;
                                //pido las actividades que cuelgan del objetivo
                                $arrayelementos['plan_arc'][$key]['objetivos'][$pos]['actividades']
                                    = DatElementosDatElementos::BuscarElementosHijos(
                                    $objetivo['idelemento'],
                                    $arrayidtipoelemento, $arrayorigen,
                                    $objelemento->idusuariocrea
                                );
                            }
                        }
                    }
                }
                //pido las actividades relacionadas directamente con el plan
                $arrayidtipoelemento[0]['idtipoelemento'] = 3;
                $arrayorigen[0]['origen'] = 3;
                $arrayorigen[1]['origen'] = 1;
                $arrayelementos['plan_activ']
                    = DatElementosDatElementos::BuscarElementosHijos(
                    $objelemento->idelemento, $arrayidtipoelemento,
                    $arrayorigen, $objelemento->idusuariocrea
                );
                break;
            case 1:
                //pido los criterios que cuelgan del objetivo
                $arrayelementos['plan_arc_obj'][]['citerios']
                    = DatCriteriomedida::ObtenerCriteriosByOvjetivo(
                    $objetivo['idelemento']
                );
                $arrayidtipoelemento[0]['idtipoelemento'] = 1;
                $arrayorigen[0]['origen'] = 3;
                $arrayorigen[1]['origen'] = 1;
                //pido las actividades que cuelgan del objetivo
                $arrayelementos['plan_arc_obj'][]['actividades']
                    = DatElementosDatElementos::BuscarElementosHijos(
                    $objetivo['idelemento'], $arrayidtipoelemento, $arrayorigen,
                    $objelemento->idusuariocrea
                );
                break;
        }
        return $arrayelementos;
    }

    public function ObtenerArregloDeDependenciasParaDesgloce(
        $objelemento, $arrayelementos, $idtipoelemento, $objplangeneral
    ) {
        switch ($idtipoelemento) {
            case 0://plan
                //primero pido las areas relacionadas con el plan
                $arrayelementos['plan_arc']
                    = DatArcDatPlan::ObtenerAreasPorPlanes(
                    $objelemento->idelemento
                );
                $arrayidtipoelemento[0]['idtipoelemento'] = 3;
                $arrayorigen[0]['origen'] = 3;
                $arrayorigen[1]['origen'] = 1;
                //pido las actividades relacionadas directamente con el plan
                $arrayelementos['plan_activ']
                    = DatElementosDatElementos::BuscarElementosHijos(
                    $objelemento->idelemento, $arrayidtipoelemento,
                    $arrayorigen, $objelemento->idusuariocrea
                );
                break;
            case 1://objetivo
                //pido los criterios del objetivo
                $arrayelementos['criterios']
                    = DatCriteriomedida::ObtenerCriteriosByOvjetivo(
                    $objelemento->idelemento
                );
                //pido las actividades que cuelgan al objetivo
                $arrayelementos['actividades']
                    = DatElementosDatElementos::BuscarActivHijasDeObjet(
                    $objelemento->idelemento, $objplangeneral->idusuariocrea
                );
                break;
            case 4://arc
                //pido las actividades que cuelgan al plan mediante areas
                $arrayelementos['actividades']
                    = DatArcDatPlanActividades::ObtenerRelacionPlanArcActByPlanArc(
                    $objplangeneral->idelemento, $objelemento->idarc,
                    $objplangeneral->idusuariocrea
                );
                //pido los objetivos que cuelgan del plan medinate areas
                $arrayelementos['objetivos']
                    = DatArcDatPlanObjetivo::ObtenerRelacionObjetivoArcActByPlanArc(
                    $objplangeneral->idelemento, $objelemento->idarc,
                    $objplangeneral->idusuariocrea
                );
                break;
            case 2://fip
                $arrayidtipoelemento[0]['idtipoelemento'] = 3;
                $arrayorigen[0]['origen'] = 3;
                $arrayorigen[1]['origen'] = 1;
                //pido las actividades relacionadas directamente con el plan
                $arrayelementos['fip_activ']
                    = DatElementosDatElementos::BuscarElementosHijos(
                    $objelemento->idelemento, $arrayidtipoelemento,
                    $arrayorigen, $objelemento->idusuariocrea
                );
                break;
        }
        return $arrayelementos;
    }

    public function ActualizarEstadoAElemento($idelemento, $idestadofinal)
    {
        $objobjetivo = Doctrine::getTable('DatElementos')->find($idelemento);
        $objobjetivo->idestadoaprob = $idestadofinal;
        $objobjetivo->save();
    }

    public function ObtenerActividadesPorAreas(
        /*$idusuariosession, $valueanno, $textomeses, $valuemeses, $fechainicio,
        $fechafin, $idplan, $idreporte, $conductor, $nombreusuario, $encabezado,
        $piepagina, $principales, $confidencialidad, $textconfidencialidad,
        $tituloreporte, $rangofecha, $arrayidautor, $arrayidinvol, $operador,
        $arrayidnom, $arrayestados, $todoscrit*/
    )
    {
        //$objelementosmodel = new DatElementosModel();
    }

    public function DesglozarElemento($idelemento)
    {
        $objelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if ($objelemento->idtipoelemento != 3) {
            $arrayelementosdesglose = array();
            $arrayelementos = $this->ObtenerArregloDeDependencias(
                $objelemento, $arrayelementos
            );
            $cont = 0;
            if (isset($arrayelementos['plan_arc'][0])) {
                foreach ($arrayelementos['plan_arc'] as $arc) {
                    $objarc = Doctrine::getTable('DatArc')->find(
                        $objarc->idarc
                    );
                    $arrayelementosdesglose[$cont]['id']
                        = $idelemento . $objarc->idarc;
                    $arrayelementosdesglose[$cont]['tipoelemento'] = 'ARC';
                    $arrayelementosdesglose[$cont]['idelemento']
                        = $objarc->idarc;
                    $arrayelementosdesglose[$cont]['denelemento']
                        = $objarc->denarc;
                    $arrayelementosdesglose[$cont]['fechainicio']
                        = $objarc->fechainicio;
                    $arrayelementosdesglose[$cont]['fechafin']
                        = $objarc->fechafin;
                    $arrayelementosdesglose[$cont]['estadoaprobacion']
                        = '-----';
                    $arrayelementosdesglose[$cont]['estadocumplimiento']
                        = '-----';
                    $arrayelementosdesglose[$cont]['autor']
                        = $this->integrator->seguridad->nombreUsuario(
                        $objarc->idusuariocrea
                    );
                    $cont++;
                }
            }
            if (isset($arrayelementos['plan_activ'][0])) {
                $arrayactividades = $arrayelementos['plan_activ'];
                foreach (
                    $arrayactividades as /*$keyarcact =>*/
                    $actividad
                ) {
                    $respuesta = $this->pIntegrator->workflow->Ejecutar(
                        $idusuariosession, $actividad['idestadoaprob'],
                        $idestadofinal, $idtipodoc = 3, $obj, $idsubsistema
                    );
                    if ($respuesta['tipo'] == 1) {
                        $this->ActualizarEstadoAElemento(
                            $actividad['idelemento'], $idestadofinal
                        );
                    }
                }
            }
        }
        return $arrayelementosdesglose;
    }

    public function EliminarRelacionesElementos($idelemento)
    {
        $obelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        switch ($obelemento->idtipoelemento) {
            case 0:
                $arrayrelaciones = DatElementosDatElementos::BuscarElementos(
                    $idelemento
                );
                if (isset($arrayrelaciones[0])) {
                    foreach ($arrayrelaciones as $relacion) {
                        DatElementosDatElementos::EliminarRelaciones(
                            $idelemento
                        );
                    }
                }
                break;
        }
    }


}

