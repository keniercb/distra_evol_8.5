SELECT td.*
FROM mod_estructuracomp.nom_filaestruc td
INNER JOIN mod_estructuracomp.nom_filaestruc hoja ON hoja.idfila = p_idcargo  -- ID de la hoja cargo
WHERE td.parent_path @> hoja.parent_path  -- Todos los ancestros
  AND td.idconcepto = 3
  AND td.parent_path != hoja.parent_path  -- Excluir la hoja misma
ORDER BY nlevel(td.parent_path) DESC  -- Ordenar del más cercano al más lejano
LIMIT 1;  -- Tomar el más cercano a la hoja
