ALTER SCHEMA mod_estructuracomp OWNER TO zeolides;
ALTER TYPE mod_estructuracomp.td_tablaorganizacion OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.crear_dominiofila(numeric, bit[]) OWNER TO zeolides;
GRANT EXECUTE ON FUNCTION mod_estructuracomp.crear_dominiofila(numeric, bit[]) TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_actualizar_actual_visible() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_cambiar_orden(hijo numeric, paramorden numeric) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_cancelar_proyecto(proyecto numeric) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_copiar_estructura(idnodo numeric, idnodopadre numeric, proyecto numeric, cortar boolean) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_cortar_estructura(idnodo numeric, idnodopadre numeric, proyecto numeric) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_deshacer_eliminar(proyecto numeric, lft numeric, rgt numeric) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_deshacer_proyecto(identificador numeric, proyecto numeric, estado numeric, concepto numeric, cortar boolean) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_duplicar_estructura(idnuevo numeric, idnodo numeric, concepto numeric, proyecto numeric) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_eliminar_por_proyecto(identificador numeric, proyecto numeric) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_eliminar_tree(table_name character varying, campo character varying, identificador numeric) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_eliminar_tree_fechafin(identificador numeric) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_merge_proyecto(ids numeric[], usser numeric) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_nueva_fila(id numeric, padre numeric, concepto numeric, orden numeric, dominio bit[], acceso bit[]) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_nueva_fila(id numeric, padre numeric, concepto numeric, orden numeric, fechaend date, dominio bit[], acceso bit[]) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_poner_en_vigor(proyecto numeric, usuario numeric) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_tablaorganizacion(p_idestructura numeric[], p_idproyecto numeric, p_iddominio numeric) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.f_update_orden_grado(identificador numeric, jerarquia numeric) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_actualizar_orden_grado() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_actualizar_organo() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_cambiargrupo(idcargo integer, idgrupoold integer, idgrupocnew integer) OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_eliminar_fila() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_eliminar_nodo_dominio() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_eliminar_proyecto() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_insertar_fila() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_insertar_nodo_dominio() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_cargo() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_categocup() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_categoria() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_concepto() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_conceptocondicion() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_conceptopropiedad() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_datsubordinacion() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_dominio() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_filaestruc() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_grado() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_grupocomplejidad() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_icono() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_medio() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_nomsubordinacion() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_preparacion() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_proyecto() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_salario() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_tipomedio() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_trabajocargo() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_trabajoestructura() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_trabajoestructuraop() OWNER TO zeolides;
ALTER FUNCTION mod_estructuracomp.ft_trabajomedio() OWNER TO zeolides;

ALTER TABLE mod_estructuracomp.aux_complemento OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_cargo OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_cargocivil OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_cargomilitar OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_conceptocondicion_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_conceptocondicion OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_estructura OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_estructuraop OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_filacortada OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_grafica OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_graficausuario OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_medio OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_proyecto_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_proyecto OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_proyectousuario OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_subordinacion OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_usuarioconcepto_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.dat_usuarioconcepto OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_cargo_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_cargo OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_categocup_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_categocup OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_categoria_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_categoria OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_categoriamilitar OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_concepto_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_concepto OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_conceptopropiedad_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_conceptopropiedad OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_condicion OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_dominio_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_dominio OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_escalasalarial_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_escalasalarial OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_estado OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_filaestruc OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_firma OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_grado_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_grado OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_grupocomplejidad_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_grupocomplejidad OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_icono_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_icono OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_organo OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_preparacion_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_preparacion OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_propiedad OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_relacion OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_salario_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_salario OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_nomsubordinacion_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_subordinacion OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_tipoescala OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_tipomedio_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.nom_tipomedio OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_campoestruc_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_escala_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_medio_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_filaestruc_seq OWNER TO zeolides;
ALTER TABLE mod_estructuracomp.sec_firma_seq OWNER TO zeolides;

--
-- TOC entry 8294 (class 0 OID 0)
-- Dependencies: 33
-- Name: mod_estructuracomp; Type: ACL; Schema: -; Owner: zeolides
--

REVOKE ALL ON SCHEMA mod_estructuracomp FROM PUBLIC;
REVOKE ALL ON SCHEMA mod_estructuracomp FROM zeolides;
GRANT ALL ON SCHEMA mod_estructuracomp TO zeolides;


--
-- TOC entry 8295 (class 0 OID 0)
-- Dependencies: 2692
-- Name: crear_dominiofila(numeric, bit[]); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION crear_dominiofila(iddominio numeric, dominiofila bit[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION crear_dominiofila(iddominio numeric, dominiofila bit[]) FROM zeolides;
GRANT ALL ON FUNCTION crear_dominiofila(iddominio numeric, dominiofila bit[]) TO zeolides;


--
-- TOC entry 8296 (class 0 OID 0)
-- Dependencies: 2695
-- Name: f_cambiar_orden(numeric, numeric); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_cambiar_orden(hijo numeric, paramorden numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_cambiar_orden(hijo numeric, paramorden numeric) FROM zeolides;
GRANT ALL ON FUNCTION f_cambiar_orden(hijo numeric, paramorden numeric) TO zeolides;


--
-- TOC entry 8297 (class 0 OID 0)
-- Dependencies: 2746
-- Name: f_cancelar_proyecto(numeric); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_cancelar_proyecto(proyecto numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_cancelar_proyecto(proyecto numeric) FROM zeolides;
GRANT ALL ON FUNCTION f_cancelar_proyecto(proyecto numeric) TO zeolides;


--
-- TOC entry 8298 (class 0 OID 0)
-- Dependencies: 2747
-- Name: f_copiar_estructura(numeric, numeric, numeric, boolean); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_copiar_estructura(idnodo numeric, idnodopadre numeric, proyecto numeric, cortar boolean) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_copiar_estructura(idnodo numeric, idnodopadre numeric, proyecto numeric, cortar boolean) FROM zeolides;
GRANT ALL ON FUNCTION f_copiar_estructura(idnodo numeric, idnodopadre numeric, proyecto numeric, cortar boolean) TO zeolides;


--
-- TOC entry 8299 (class 0 OID 0)
-- Dependencies: 2748
-- Name: f_cortar_estructura(numeric, numeric, numeric); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_cortar_estructura(idnodo numeric, idnodopadre numeric, proyecto numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_cortar_estructura(idnodo numeric, idnodopadre numeric, proyecto numeric) FROM zeolides;
GRANT ALL ON FUNCTION f_cortar_estructura(idnodo numeric, idnodopadre numeric, proyecto numeric) TO zeolides;


--
-- TOC entry 8300 (class 0 OID 0)
-- Dependencies: 2749
-- Name: f_deshacer_eliminar(numeric, numeric, numeric); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_deshacer_eliminar(proyecto numeric, lft numeric, rgt numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_deshacer_eliminar(proyecto numeric, lft numeric, rgt numeric) FROM zeolides;
GRANT ALL ON FUNCTION f_deshacer_eliminar(proyecto numeric, lft numeric, rgt numeric) TO zeolides;


--
-- TOC entry 8301 (class 0 OID 0)
-- Dependencies: 2750
-- Name: f_deshacer_proyecto(numeric, numeric, numeric, numeric, boolean); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_deshacer_proyecto(identificador numeric, proyecto numeric, estado numeric, concepto numeric, cortar boolean) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_deshacer_proyecto(identificador numeric, proyecto numeric, estado numeric, concepto numeric, cortar boolean) FROM zeolides;
GRANT ALL ON FUNCTION f_deshacer_proyecto(identificador numeric, proyecto numeric, estado numeric, concepto numeric, cortar boolean) TO zeolides;


--
-- TOC entry 8302 (class 0 OID 0)
-- Dependencies: 2751
-- Name: f_duplicar_estructura(numeric, numeric, numeric, numeric); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_duplicar_estructura(idnuevo numeric, idnodo numeric, concepto numeric, proyecto numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_duplicar_estructura(idnuevo numeric, idnodo numeric, concepto numeric, proyecto numeric) FROM zeolides;
GRANT ALL ON FUNCTION f_duplicar_estructura(idnuevo numeric, idnodo numeric, concepto numeric, proyecto numeric) TO zeolides;


--
-- TOC entry 8303 (class 0 OID 0)
-- Dependencies: 2752
-- Name: f_eliminar_por_proyecto(numeric, numeric); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_eliminar_por_proyecto(identificador numeric, proyecto numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_eliminar_por_proyecto(identificador numeric, proyecto numeric) FROM zeolides;
GRANT ALL ON FUNCTION f_eliminar_por_proyecto(identificador numeric, proyecto numeric) TO zeolides;


--
-- TOC entry 8304 (class 0 OID 0)
-- Dependencies: 2753
-- Name: f_eliminar_tree(character varying, character varying, numeric); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_eliminar_tree(table_name character varying, campo character varying, identificador numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_eliminar_tree(table_name character varying, campo character varying, identificador numeric) FROM zeolides;
GRANT ALL ON FUNCTION f_eliminar_tree(table_name character varying, campo character varying, identificador numeric) TO zeolides;


--
-- TOC entry 8305 (class 0 OID 0)
-- Dependencies: 2744
-- Name: f_eliminar_tree_fechafin(numeric); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_eliminar_tree_fechafin(identificador numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_eliminar_tree_fechafin(identificador numeric) FROM zeolides;
GRANT ALL ON FUNCTION f_eliminar_tree_fechafin(identificador numeric) TO zeolides;


--
-- TOC entry 8306 (class 0 OID 0)
-- Dependencies: 2745
-- Name: f_merge_proyecto(numeric[], numeric); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_merge_proyecto(ids numeric[], usser numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_merge_proyecto(ids numeric[], usser numeric) FROM zeolides;
GRANT ALL ON FUNCTION f_merge_proyecto(ids numeric[], usser numeric) TO zeolides;


--
-- TOC entry 8307 (class 0 OID 0)
-- Dependencies: 2740
-- Name: f_nueva_fila(numeric, numeric, numeric, numeric, bit[], bit[]); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_nueva_fila(id numeric, padre numeric, concepto numeric, orden numeric, dominio bit[], acceso bit[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_nueva_fila(id numeric, padre numeric, concepto numeric, orden numeric, dominio bit[], acceso bit[]) FROM zeolides;
GRANT ALL ON FUNCTION f_nueva_fila(id numeric, padre numeric, concepto numeric, orden numeric, dominio bit[], acceso bit[]) TO zeolides;
GRANT ALL ON FUNCTION f_nueva_fila(id numeric, padre numeric, concepto numeric, orden numeric, dominio bit[], acceso bit[]) TO PUBLIC;


--
-- TOC entry 8308 (class 0 OID 0)
-- Dependencies: 2754
-- Name: f_poner_en_vigor(numeric, numeric); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_poner_en_vigor(proyecto numeric, usuario numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_poner_en_vigor(proyecto numeric, usuario numeric) FROM zeolides;
GRANT ALL ON FUNCTION f_poner_en_vigor(proyecto numeric, usuario numeric) TO zeolides;


--
-- TOC entry 8309 (class 0 OID 0)
-- Dependencies: 2755
-- Name: f_tablaorganizacion(numeric[], numeric, numeric); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_tablaorganizacion(p_idestructura numeric[], p_idproyecto numeric, p_iddominio numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_tablaorganizacion(p_idestructura numeric[], p_idproyecto numeric, p_iddominio numeric) FROM zeolides;
GRANT ALL ON FUNCTION f_tablaorganizacion(p_idestructura numeric[], p_idproyecto numeric, p_iddominio numeric) TO zeolides;


--
-- TOC entry 8310 (class 0 OID 0)
-- Dependencies: 2756
-- Name: f_update_orden_grado(numeric, numeric); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION f_update_orden_grado(identificador numeric, jerarquia numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION f_update_orden_grado(identificador numeric, jerarquia numeric) FROM zeolides;
GRANT ALL ON FUNCTION f_update_orden_grado(identificador numeric, jerarquia numeric) TO zeolides;


--
-- TOC entry 8311 (class 0 OID 0)
-- Dependencies: 2757
-- Name: ft_actualizar_orden_grado(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_actualizar_orden_grado() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_actualizar_orden_grado() FROM zeolides;
GRANT ALL ON FUNCTION ft_actualizar_orden_grado() TO zeolides;


--
-- TOC entry 8312 (class 0 OID 0)
-- Dependencies: 2758
-- Name: ft_actualizar_organo(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_actualizar_organo() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_actualizar_organo() FROM zeolides;
GRANT ALL ON FUNCTION ft_actualizar_organo() TO zeolides;


--
-- TOC entry 8314 (class 0 OID 0)
-- Dependencies: 2759
-- Name: ft_eliminar_fila(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_eliminar_fila() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_eliminar_fila() FROM zeolides;
GRANT ALL ON FUNCTION ft_eliminar_fila() TO zeolides;


--
-- TOC entry 8315 (class 0 OID 0)
-- Dependencies: 2760
-- Name: ft_eliminar_nodo_dominio(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_eliminar_nodo_dominio() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_eliminar_nodo_dominio() FROM zeolides;
GRANT ALL ON FUNCTION ft_eliminar_nodo_dominio() TO zeolides;


--
-- TOC entry 8317 (class 0 OID 0)
-- Dependencies: 2761
-- Name: ft_eliminar_proyecto(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_eliminar_proyecto() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_eliminar_proyecto() FROM zeolides;
GRANT ALL ON FUNCTION ft_eliminar_proyecto() TO zeolides;


--
-- TOC entry 8319 (class 0 OID 0)
-- Dependencies: 2763
-- Name: ft_insertar_fila(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_insertar_fila() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_insertar_fila() FROM zeolides;
GRANT ALL ON FUNCTION ft_insertar_fila() TO zeolides;


--
-- TOC entry 8320 (class 0 OID 0)
-- Dependencies: 2762
-- Name: ft_insertar_nodo_dominio(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_insertar_nodo_dominio() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_insertar_nodo_dominio() FROM zeolides;
GRANT ALL ON FUNCTION ft_insertar_nodo_dominio() TO zeolides;


--
-- TOC entry 8322 (class 0 OID 0)
-- Dependencies: 2764
-- Name: ft_reiniciar_secuencia_cargo(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_cargo() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_cargo() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_cargo() TO zeolides;


--
-- TOC entry 8324 (class 0 OID 0)
-- Dependencies: 2765
-- Name: ft_reiniciar_secuencia_categocup(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_categocup() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_categocup() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_categocup() TO zeolides;


--
-- TOC entry 8326 (class 0 OID 0)
-- Dependencies: 2766
-- Name: ft_reiniciar_secuencia_categoria(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_categoria() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_categoria() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_categoria() TO zeolides;


--
-- TOC entry 8328 (class 0 OID 0)
-- Dependencies: 2767
-- Name: ft_reiniciar_secuencia_concepto(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_concepto() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_concepto() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_concepto() TO zeolides;


--
-- TOC entry 8329 (class 0 OID 0)
-- Dependencies: 2741
-- Name: ft_reiniciar_secuencia_conceptocondicion(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_conceptocondicion() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_conceptocondicion() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_conceptocondicion() TO zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_conceptocondicion() TO PUBLIC;


--
-- TOC entry 8331 (class 0 OID 0)
-- Dependencies: 2768
-- Name: ft_reiniciar_secuencia_conceptopropiedad(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_conceptopropiedad() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_conceptopropiedad() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_conceptopropiedad() TO zeolides;


--
-- TOC entry 8333 (class 0 OID 0)
-- Dependencies: 2769
-- Name: ft_reiniciar_secuencia_datsubordinacion(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_datsubordinacion() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_datsubordinacion() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_datsubordinacion() TO zeolides;


--
-- TOC entry 8335 (class 0 OID 0)
-- Dependencies: 2770
-- Name: ft_reiniciar_secuencia_dominio(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_dominio() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_dominio() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_dominio() TO zeolides;


--
-- TOC entry 8337 (class 0 OID 0)
-- Dependencies: 2739
-- Name: ft_reiniciar_secuencia_filaestruc(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_filaestruc() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_filaestruc() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_filaestruc() TO zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_filaestruc() TO PUBLIC;


--
-- TOC entry 8339 (class 0 OID 0)
-- Dependencies: 2771
-- Name: ft_reiniciar_secuencia_grado(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_grado() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_grado() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_grado() TO zeolides;


--
-- TOC entry 8341 (class 0 OID 0)
-- Dependencies: 2772
-- Name: ft_reiniciar_secuencia_grupocomplejidad(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_grupocomplejidad() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_grupocomplejidad() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_grupocomplejidad() TO zeolides;


--
-- TOC entry 8343 (class 0 OID 0)
-- Dependencies: 2773
-- Name: ft_reiniciar_secuencia_icono(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_icono() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_icono() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_icono() TO zeolides;


--
-- TOC entry 8345 (class 0 OID 0)
-- Dependencies: 2774
-- Name: ft_reiniciar_secuencia_medio(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_medio() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_medio() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_medio() TO zeolides;


--
-- TOC entry 8347 (class 0 OID 0)
-- Dependencies: 2775
-- Name: ft_reiniciar_secuencia_nomsubordinacion(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_nomsubordinacion() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_nomsubordinacion() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_nomsubordinacion() TO zeolides;


--
-- TOC entry 8349 (class 0 OID 0)
-- Dependencies: 2776
-- Name: ft_reiniciar_secuencia_preparacion(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_preparacion() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_preparacion() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_preparacion() TO zeolides;


--
-- TOC entry 8351 (class 0 OID 0)
-- Dependencies: 2778
-- Name: ft_reiniciar_secuencia_proyecto(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_proyecto() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_proyecto() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_proyecto() TO zeolides;


--
-- TOC entry 8353 (class 0 OID 0)
-- Dependencies: 2779
-- Name: ft_reiniciar_secuencia_salario(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_salario() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_salario() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_salario() TO zeolides;


--
-- TOC entry 8355 (class 0 OID 0)
-- Dependencies: 2780
-- Name: ft_reiniciar_secuencia_tipomedio(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_tipomedio() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_reiniciar_secuencia_tipomedio() FROM zeolides;
GRANT ALL ON FUNCTION ft_reiniciar_secuencia_tipomedio() TO zeolides;


--
-- TOC entry 8356 (class 0 OID 0)
-- Dependencies: 2781
-- Name: ft_trabajocargo(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_trabajocargo() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_trabajocargo() FROM zeolides;
GRANT ALL ON FUNCTION ft_trabajocargo() TO zeolides;


--
-- TOC entry 8357 (class 0 OID 0)
-- Dependencies: 2782
-- Name: ft_trabajoestructura(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_trabajoestructura() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_trabajoestructura() FROM zeolides;
GRANT ALL ON FUNCTION ft_trabajoestructura() TO zeolides;


--
-- TOC entry 8358 (class 0 OID 0)
-- Dependencies: 2777
-- Name: ft_trabajoestructuraop(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_trabajoestructuraop() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_trabajoestructuraop() FROM zeolides;
GRANT ALL ON FUNCTION ft_trabajoestructuraop() TO zeolides;


--
-- TOC entry 8359 (class 0 OID 0)
-- Dependencies: 2721
-- Name: ft_trabajomedio(); Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON FUNCTION ft_trabajomedio() FROM PUBLIC;
REVOKE ALL ON FUNCTION ft_trabajomedio() FROM zeolides;
GRANT ALL ON FUNCTION ft_trabajomedio() TO zeolides;


--
-- TOC entry 8362 (class 0 OID 0)
-- Dependencies: 2244
-- Name: aux_complemento; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE aux_complemento FROM PUBLIC;
REVOKE ALL ON TABLE aux_complemento FROM zeolides;
GRANT ALL ON TABLE aux_complemento TO zeolides;


--
-- TOC entry 8375 (class 0 OID 0)
-- Dependencies: 1706
-- Name: dat_cargo; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_cargo FROM PUBLIC;
REVOKE ALL ON TABLE dat_cargo FROM zeolides;
GRANT ALL ON TABLE dat_cargo TO zeolides;


--
-- TOC entry 8380 (class 0 OID 0)
-- Dependencies: 1707
-- Name: dat_cargocivil; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_cargocivil FROM PUBLIC;
REVOKE ALL ON TABLE dat_cargocivil FROM zeolides;
GRANT ALL ON TABLE dat_cargocivil TO zeolides;


--
-- TOC entry 8385 (class 0 OID 0)
-- Dependencies: 1708
-- Name: dat_cargomilitar; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_cargomilitar FROM PUBLIC;
REVOKE ALL ON TABLE dat_cargomilitar FROM zeolides;
GRANT ALL ON TABLE dat_cargomilitar TO zeolides;


--
-- TOC entry 8387 (class 0 OID 0)
-- Dependencies: 2242
-- Name: sec_conceptocondicion_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_conceptocondicion_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_conceptocondicion_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_conceptocondicion_seq TO zeolides;


--
-- TOC entry 8393 (class 0 OID 0)
-- Dependencies: 2243
-- Name: dat_conceptocondicion; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_conceptocondicion FROM PUBLIC;
REVOKE ALL ON TABLE dat_conceptocondicion FROM zeolides;
GRANT ALL ON TABLE dat_conceptocondicion TO zeolides;


--
-- TOC entry 8412 (class 0 OID 0)
-- Dependencies: 1709
-- Name: dat_estructura; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_estructura FROM PUBLIC;
REVOKE ALL ON TABLE dat_estructura FROM zeolides;
GRANT ALL ON TABLE dat_estructura TO zeolides;


--
-- TOC entry 8420 (class 0 OID 0)
-- Dependencies: 1710
-- Name: dat_estructuraop; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_estructuraop FROM PUBLIC;
REVOKE ALL ON TABLE dat_estructuraop FROM zeolides;
GRANT ALL ON TABLE dat_estructuraop TO zeolides;


--
-- TOC entry 8425 (class 0 OID 0)
-- Dependencies: 1711
-- Name: dat_filacortada; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_filacortada FROM PUBLIC;
REVOKE ALL ON TABLE dat_filacortada FROM zeolides;
GRANT ALL ON TABLE dat_filacortada TO zeolides;


--
-- TOC entry 8431 (class 0 OID 0)
-- Dependencies: 1712
-- Name: dat_grafica; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_grafica FROM PUBLIC;
REVOKE ALL ON TABLE dat_grafica FROM zeolides;
GRANT ALL ON TABLE dat_grafica TO zeolides;


--
-- TOC entry 8435 (class 0 OID 0)
-- Dependencies: 1713
-- Name: dat_graficausuario; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_graficausuario FROM PUBLIC;
REVOKE ALL ON TABLE dat_graficausuario FROM zeolides;
GRANT ALL ON TABLE dat_graficausuario TO zeolides;


--
-- TOC entry 8443 (class 0 OID 0)
-- Dependencies: 1714
-- Name: dat_medio; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_medio FROM PUBLIC;
REVOKE ALL ON TABLE dat_medio FROM zeolides;
GRANT ALL ON TABLE dat_medio TO zeolides;


--
-- TOC entry 8445 (class 0 OID 0)
-- Dependencies: 1715
-- Name: sec_proyecto_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_proyecto_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_proyecto_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_proyecto_seq TO zeolides;


--
-- TOC entry 8455 (class 0 OID 0)
-- Dependencies: 1716
-- Name: dat_proyecto; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_proyecto FROM PUBLIC;
REVOKE ALL ON TABLE dat_proyecto FROM zeolides;
GRANT ALL ON TABLE dat_proyecto TO zeolides;


--
-- TOC entry 8461 (class 0 OID 0)
-- Dependencies: 1717
-- Name: dat_proyectousuario; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_proyectousuario FROM PUBLIC;
REVOKE ALL ON TABLE dat_proyectousuario FROM zeolides;
GRANT ALL ON TABLE dat_proyectousuario TO zeolides;


--
-- TOC entry 8463 (class 0 OID 0)
-- Dependencies: 1718
-- Name: sec_datsubordinacion_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_datsubordinacion_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_datsubordinacion_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_datsubordinacion_seq TO zeolides;


--
-- TOC entry 8469 (class 0 OID 0)
-- Dependencies: 1719
-- Name: dat_subordinacion; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_subordinacion FROM PUBLIC;
REVOKE ALL ON TABLE dat_subordinacion FROM zeolides;
GRANT ALL ON TABLE dat_subordinacion TO zeolides;


--
-- TOC entry 8471 (class 0 OID 0)
-- Dependencies: 1720
-- Name: sec_usuarioconcepto_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_usuarioconcepto_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_usuarioconcepto_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_usuarioconcepto_seq TO zeolides;


--
-- TOC entry 8474 (class 0 OID 0)
-- Dependencies: 1721
-- Name: dat_usuarioconcepto; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE dat_usuarioconcepto FROM PUBLIC;
REVOKE ALL ON TABLE dat_usuarioconcepto FROM zeolides;
GRANT ALL ON TABLE dat_usuarioconcepto TO zeolides;


--
-- TOC entry 8476 (class 0 OID 0)
-- Dependencies: 1722
-- Name: sec_cargo_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_cargo_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_cargo_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_cargo_seq TO zeolides;


--
-- TOC entry 8487 (class 0 OID 0)
-- Dependencies: 1723
-- Name: nom_cargo; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_cargo FROM PUBLIC;
REVOKE ALL ON TABLE nom_cargo FROM zeolides;
GRANT ALL ON TABLE nom_cargo TO zeolides;


--
-- TOC entry 8489 (class 0 OID 0)
-- Dependencies: 1724
-- Name: sec_categocup_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_categocup_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_categocup_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_categocup_seq TO zeolides;


--
-- TOC entry 8500 (class 0 OID 0)
-- Dependencies: 1725
-- Name: nom_categocup; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_categocup FROM PUBLIC;
REVOKE ALL ON TABLE nom_categocup FROM zeolides;
GRANT ALL ON TABLE nom_categocup TO zeolides;


--
-- TOC entry 8501 (class 0 OID 0)
-- Dependencies: 1726
-- Name: sec_categoria_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_categoria_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_categoria_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_categoria_seq TO zeolides;


--
-- TOC entry 8504 (class 0 OID 0)
-- Dependencies: 1727
-- Name: nom_categoria; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_categoria FROM PUBLIC;
REVOKE ALL ON TABLE nom_categoria FROM zeolides;
GRANT ALL ON TABLE nom_categoria TO zeolides;


--
-- TOC entry 8508 (class 0 OID 0)
-- Dependencies: 1728
-- Name: nom_categoriamilitar; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_categoriamilitar FROM PUBLIC;
REVOKE ALL ON TABLE nom_categoriamilitar FROM zeolides;
GRANT ALL ON TABLE nom_categoriamilitar TO zeolides;


--
-- TOC entry 8510 (class 0 OID 0)
-- Dependencies: 1729
-- Name: sec_concepto_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_concepto_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_concepto_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_concepto_seq TO zeolides;


--
-- TOC entry 8517 (class 0 OID 0)
-- Dependencies: 1730
-- Name: nom_concepto; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_concepto FROM PUBLIC;
REVOKE ALL ON TABLE nom_concepto FROM zeolides;
GRANT ALL ON TABLE nom_concepto TO zeolides;


--
-- TOC entry 8519 (class 0 OID 0)
-- Dependencies: 1731
-- Name: sec_conceptopropiedad_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_conceptopropiedad_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_conceptopropiedad_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_conceptopropiedad_seq TO zeolides;


--
-- TOC entry 8524 (class 0 OID 0)
-- Dependencies: 1732
-- Name: nom_conceptopropiedad; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_conceptopropiedad FROM PUBLIC;
REVOKE ALL ON TABLE nom_conceptopropiedad FROM zeolides;
GRANT ALL ON TABLE nom_conceptopropiedad TO zeolides;


--
-- TOC entry 8528 (class 0 OID 0)
-- Dependencies: 1733
-- Name: nom_condicion; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_condicion FROM PUBLIC;
REVOKE ALL ON TABLE nom_condicion FROM zeolides;
GRANT ALL ON TABLE nom_condicion TO zeolides;


--
-- TOC entry 8530 (class 0 OID 0)
-- Dependencies: 1734
-- Name: sec_dominio_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_dominio_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_dominio_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_dominio_seq TO zeolides;


--
-- TOC entry 8542 (class 0 OID 0)
-- Dependencies: 1735
-- Name: nom_dominio; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_dominio FROM PUBLIC;
REVOKE ALL ON TABLE nom_dominio FROM zeolides;
GRANT ALL ON TABLE nom_dominio TO zeolides;


--
-- TOC entry 8544 (class 0 OID 0)
-- Dependencies: 1736
-- Name: sec_escalasalarial_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_escalasalarial_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_escalasalarial_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_escalasalarial_seq TO zeolides;


--
-- TOC entry 8553 (class 0 OID 0)
-- Dependencies: 1737
-- Name: nom_escalasalarial; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_escalasalarial FROM PUBLIC;
REVOKE ALL ON TABLE nom_escalasalarial FROM zeolides;
GRANT ALL ON TABLE nom_escalasalarial TO zeolides;


--
-- TOC entry 8554 (class 0 OID 0)
-- Dependencies: 1738
-- Name: nom_estado; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_estado FROM PUBLIC;
REVOKE ALL ON TABLE nom_estado FROM zeolides;
GRANT ALL ON TABLE nom_estado TO zeolides;


--
-- TOC entry 8556 (class 0 OID 0)
-- Dependencies: 1739
-- Name: sec_filaestruc_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_filaestruc_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_filaestruc_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_filaestruc_seq TO zeolides;


--
-- TOC entry 8569 (class 0 OID 0)
-- Dependencies: 1740
-- Name: nom_filaestruc; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_filaestruc FROM PUBLIC;
REVOKE ALL ON TABLE nom_filaestruc FROM zeolides;
GRANT ALL ON TABLE nom_filaestruc TO zeolides;


--
-- TOC entry 8571 (class 0 OID 0)
-- Dependencies: 1741
-- Name: sec_grado_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_grado_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_grado_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_grado_seq TO zeolides;


--
-- TOC entry 8584 (class 0 OID 0)
-- Dependencies: 1742
-- Name: nom_grado; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_grado FROM PUBLIC;
REVOKE ALL ON TABLE nom_grado FROM zeolides;
GRANT ALL ON TABLE nom_grado TO zeolides;


--
-- TOC entry 8586 (class 0 OID 0)
-- Dependencies: 1743
-- Name: sec_grupocomplejidad_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_grupocomplejidad_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_grupocomplejidad_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_grupocomplejidad_seq TO zeolides;


--
-- TOC entry 8595 (class 0 OID 0)
-- Dependencies: 1744
-- Name: nom_grupocomplejidad; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_grupocomplejidad FROM PUBLIC;
REVOKE ALL ON TABLE nom_grupocomplejidad FROM zeolides;
GRANT ALL ON TABLE nom_grupocomplejidad TO zeolides;


--
-- TOC entry 8597 (class 0 OID 0)
-- Dependencies: 1745
-- Name: sec_icono_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_icono_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_icono_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_icono_seq TO zeolides;


--
-- TOC entry 8607 (class 0 OID 0)
-- Dependencies: 1746
-- Name: nom_icono; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_icono FROM PUBLIC;
REVOKE ALL ON TABLE nom_icono FROM zeolides;
GRANT ALL ON TABLE nom_icono TO zeolides;


--
-- TOC entry 8618 (class 0 OID 0)
-- Dependencies: 1747
-- Name: nom_organo; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_organo FROM PUBLIC;
REVOKE ALL ON TABLE nom_organo FROM zeolides;
GRANT ALL ON TABLE nom_organo TO zeolides;


--
-- TOC entry 8620 (class 0 OID 0)
-- Dependencies: 1748
-- Name: sec_preparacion_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_preparacion_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_preparacion_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_preparacion_seq TO zeolides;


--
-- TOC entry 8629 (class 0 OID 0)
-- Dependencies: 1749
-- Name: nom_preparacion; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_preparacion FROM PUBLIC;
REVOKE ALL ON TABLE nom_preparacion FROM zeolides;
GRANT ALL ON TABLE nom_preparacion TO zeolides;


--
-- TOC entry 8635 (class 0 OID 0)
-- Dependencies: 1750
-- Name: nom_propiedad; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_propiedad FROM PUBLIC;
REVOKE ALL ON TABLE nom_propiedad FROM zeolides;
GRANT ALL ON TABLE nom_propiedad TO zeolides;


--
-- TOC entry 8640 (class 0 OID 0)
-- Dependencies: 1751
-- Name: nom_relacion; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_relacion FROM PUBLIC;
REVOKE ALL ON TABLE nom_relacion FROM zeolides;
GRANT ALL ON TABLE nom_relacion TO zeolides;


--
-- TOC entry 8642 (class 0 OID 0)
-- Dependencies: 1752
-- Name: sec_salario_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_salario_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_salario_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_salario_seq TO zeolides;


--
-- TOC entry 8651 (class 0 OID 0)
-- Dependencies: 1753
-- Name: nom_salario; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_salario FROM PUBLIC;
REVOKE ALL ON TABLE nom_salario FROM zeolides;
GRANT ALL ON TABLE nom_salario TO zeolides;


--
-- TOC entry 8653 (class 0 OID 0)
-- Dependencies: 1754
-- Name: sec_nomsubordinacion_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_nomsubordinacion_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_nomsubordinacion_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_nomsubordinacion_seq TO zeolides;


--
-- TOC entry 8662 (class 0 OID 0)
-- Dependencies: 1755
-- Name: nom_subordinacion; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_subordinacion FROM PUBLIC;
REVOKE ALL ON TABLE nom_subordinacion FROM zeolides;
GRANT ALL ON TABLE nom_subordinacion TO zeolides;


--
-- TOC entry 8664 (class 0 OID 0)
-- Dependencies: 1756
-- Name: sec_tipoescala_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_tipoescala_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_tipoescala_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_tipoescala_seq TO zeolides;


--
-- TOC entry 8673 (class 0 OID 0)
-- Dependencies: 1757
-- Name: nom_tipoescala; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_tipoescala FROM PUBLIC;
REVOKE ALL ON TABLE nom_tipoescala FROM zeolides;
GRANT ALL ON TABLE nom_tipoescala TO zeolides;


--
-- TOC entry 8675 (class 0 OID 0)
-- Dependencies: 1758
-- Name: sec_tipomedio_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_tipomedio_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_tipomedio_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_tipomedio_seq TO zeolides;


--
-- TOC entry 8684 (class 0 OID 0)
-- Dependencies: 1759
-- Name: nom_tipomedio; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON TABLE nom_tipomedio FROM PUBLIC;
REVOKE ALL ON TABLE nom_tipomedio FROM zeolides;
GRANT ALL ON TABLE nom_tipomedio TO zeolides;


--
-- TOC entry 8686 (class 0 OID 0)
-- Dependencies: 1760
-- Name: sec_campoestruc_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_campoestruc_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_campoestruc_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_campoestruc_seq TO zeolides;


--
-- TOC entry 8688 (class 0 OID 0)
-- Dependencies: 1761
-- Name: sec_escala_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_escala_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_escala_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_escala_seq TO zeolides;


--
-- TOC entry 8690 (class 0 OID 0)
-- Dependencies: 1762
-- Name: sec_medio_seq; Type: ACL; Schema: mod_estructuracomp; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_medio_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_medio_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_medio_seq TO zeolides;


-- Completed on 2015-09-16 10:58:13

--
-- PostgreSQL database dump complete
GRANT ALL ON TABLE mod_estructuracomp.nom_firma TO zeolides;
COMMENT ON COLUMN mod_estructuracomp.nom_firma.fechainicio IS 'campo para la fecha de inicio';
COMMENT ON COLUMN mod_estructuracomp.nom_firma.fechafin IS 'Campo para la fecha fin';
GRANT ALL ON TABLE mod_estructuracomp.sec_firma_seq TO zeolides;

