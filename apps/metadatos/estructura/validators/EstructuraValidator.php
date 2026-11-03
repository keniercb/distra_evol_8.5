<?php

    class EstructuraValidator
    {
        /*VALIDADORES DE MEDIOS*/
        public function ValidarInsertarMedio()
        {
            $idConcepto = $_POST['idconcepto'];
            if ($idConcepto == 9) {
                $idNomMedio = $_POST['idnommedio'];
                $idPadre    = $_POST['idnodo'];
                $datMedio   = new DatMedio();
                if ($datMedio->existeDenominacion($idNomMedio, $idPadre)) {
                    return false;
                }
            }

            return true;
        }

        public function ValidarInsertarIconoMedio()
        {
            $idConcepto = $_POST['idconcepto'];
            if ($idConcepto == 9) {
                $icono = $this->_getParam('icono', '');
                if ($icono != '' && $icono != ' ') {
                    $icono = substr($icono, strrpos($icono, '/') + 1, (strrpos($icono, '.') - strrpos($icono, '/') - 1));
                    if (NomConcepto::existeIconoConcepto($icono)) {
                        return false;
                    }
                }
            }

            return true;
        }

        public function ValidarModificarMedio()
        {
            $idConcepto = $_POST['idconcepto'];
            if ($idConcepto == 9) {
                $idNomMedio    = $_POST['idnommedio'];
                $idMedio       = $_POST['idnodo'];
                $datMedio      = new DatMedio();
                $idNomAnterior = $datMedio->buscar($idMedio);
                if ($idNomAnterior['idnommedio'] == $idNomMedio) {
                    return true;
                } else {
                    $idPadre = FilaModel::damePadreEstructura($idMedio);
                    if ($datMedio->existeDenominacion($idNomMedio, $idPadre[0]['identificador'])) {
                        return false;
                    }
                }
            }

            return true;
        }

        /*VALIDADORES DE ESTRUCTURA*/
        public function ValidarInsertarEstructura()
        {
            $idConcepto = $_POST['idconcepto'];
            if ($idConcepto <= 4) {
                $denominacion = $_POST['denominacion'];
                $idPadre      = $_POST['idnodo'];
                $iddpt = $_POST['iddpt'];
                $clase = new DatEstructura();
                if ($clase->existeDenominacion($idConcepto, $denominacion, $idPadre,$iddpt)) {
                    return false;
                }
            }

            return true;
        }

        /*VALIDADORES DE ESTRUCTURA*/
        public function ValidarInsertarEntidad()
        {
            $idConcepto = $_POST['idconcepto'];
            if ($idConcepto == 3) {
                $codigo = $_POST['codigo'];
                $clase  = new DatEstructura();
                if ($clase->existeCodigo($idConcepto, $codigo)) {
                    return false;
                }
            }

            return true;
        }

        public function ValidarModificarEntidad()
        {
            $idConcepto = $_POST['idconcepto'];
            $nodo       = $_POST['idnodo'];
            if ($idConcepto == 3) {
                $codigo = $_POST['codigo'];
                $clase  = new DatEstructura();
                if ($clase->existeCodigo($idConcepto, $codigo, $nodo)) {
                    return false;
                }
            }

            return true;
        }

        public function ValidarInsertarOrganizacion()
        {
            $idConcepto = $_POST['idconcepto'];
            if ($idConcepto == 4) {
                $codigo = $_POST['codigo'];
                $clase  = new DatEstructura();
                if ($clase->existeCodigo($idConcepto, $codigo)) {
                    return false;
                }
            }

            return true;
        }

        public function ValidarModificarOrganizacion()
        {
            $idConcepto = $_POST['idconcepto'];
            $nodo       = $_POST['idnodo'];
            if ($idConcepto == 4) {
                $codigo = $_POST['codigo'];
                $clase  = new DatEstructura();
                if ($clase->existeCodigo($idConcepto, $codigo, $nodo)) {
                    return false;
                }
            }

            return true;
        }

        public function ValidarModificarEstructura()
        {
            $idConcepto = $_POST['idconcepto'];
            if ($idConcepto <= 4) {
                $denominacion         = $_POST['denominacion'];
                $idEstructura         = $_POST['idnodo'];
                $idproyecto           = $_POST['proyecto'];
                $iddpt           = $_POST['iddpt'];
                $clase                = new DatEstructura();
                $denominacionAnterior = $clase->buscar($idEstructura, $idproyecto);
                if (strtolower($denominacionAnterior['denominacion']) == strtolower($denominacion)) {
                    return true;
                } else {
                    
                    $idPadre = FilaModel::damePadreEstructura($idEstructura);
                    
                    if ($clase->existeDenominacion($idConcepto, $denominacion, $idPadre[0]['identificador'], $iddpt)) {
                        return false;
                    }
                }
            }

            return true;
        }

        /*VALIDADORES DE ESTRUCTURAS INTERNAS*/
        public function ValidarInsertarEstructuraInterna()
        {
            $idConcepto = $_POST['idconcepto'];
            if ($idConcepto > 4 && $idConcepto <> 9 && $idConcepto <> 7) {
                $denominacion = $_POST['denominacion'];
                $idPadre      = $_POST['idnodo'];
                $clase        = new DatEstructuraop();
                if ($clase->existeDenominacion($idConcepto, $denominacion, $idPadre)) {
                    return false;
                }
            }

            return true;
        }

        public function ValidarModificarEstructuraInterna()
        {
            $idConcepto = $_POST['idconcepto'];
            if ($idConcepto == 5 || $idConcepto == 6) {
                $denominacion         = $_POST['denominacion'];
                $idEstructuraOp       = $_POST['idnodo'];
                $clase                = new DatEstructuraop();
                $denominacionAnterior = $clase->buscar($idEstructuraOp);
                if (strtolower($denominacionAnterior['denominacion']) == strtolower($denominacion)) {
                    return true;
                } else {
                    $idPadre = FilaModel::damePadreEstructura($idEstructuraOp);
                    if ($clase->existeDenominacion($idConcepto, $denominacion, $idPadre[0]['identificador'])) {
                        return false;
                    }
                }
            }

            return true;
        }

        /*VALIDADORES DE CARGOS*/
        public function ValidarInsertarCargo()
        {
            $idConcepto = $_POST['idconcepto'];
            if ($idConcepto == 7) {
                $idNomCargo  = $_POST['idnomcargo'];
                $idcategocup = $_POST['idcategocup'];
                $isCivil     = $idcategocup == '' ? false : true;
                $idPadre     = $_POST['idnodo'];
                $clase       = new DatCargo();
                if ($clase->existeDenominacion($idNomCargo, $idPadre, $isCivil, $idcategocup)) {
                    return false;
                }
            }

            return true;
        }

        public function ValidarModificarCargo()
        {
            $idConcepto = $_POST['idconcepto'];
            if ($idConcepto == 7) {
                $idNomCargo    = $_POST['idnomcargo'];
                $idcategocup   = $_POST['idcategocup'];
                $isCivil       = $idcategocup == '' ? false : true;
                $idCargo       = $_POST['idnodo'];
                $clase         = new DatCargo();
                $idNomAnterior = $clase->buscar($idCargo);
                if ($idNomAnterior[0]['idnomcargo'] == $idNomCargo) {
                    return true;
                } else {
                    $idPadre = FilaModel::damePadreEstructura($idCargo);
                    if ($clase->existeDenominacion($idNomCargo, $idPadre[0]['identificador'], $isCivil, $idcategocup)) {
                        return false;
                    }
                }
            }

            return true;
        }
    }