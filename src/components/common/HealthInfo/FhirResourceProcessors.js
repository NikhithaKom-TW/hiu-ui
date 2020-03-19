export class FhirResourceProcessor {
    supports(resource) {
      return false;
    }
    process(resource, bundleContext) {
      console.log("Noop. This should not have been called");
      throw new Error("Shouldn't be calling on FhirResourceProcessor.");
    }
};

export class ImagingStudyProcessor extends FhirResourceProcessor {
    supports(resource) {
      return resource.resourceType.toLowerCase() === "imagingstudy";
    }
    process(imagingStudy, bundleContext) {
      if (imagingStudy.endpoint) {
        imagingStudy.endpoint.forEach(ep => {
          var refResource = bundleContext.findReference("Endpoint", ep.reference);
          if (refResource) {
            ep.targetResource = refResource;
            refResource.parentResource = imagingStudy;
          }
        });
      }
    }
};
  
export class DiagnosticReportProcessor extends FhirResourceProcessor {
    supports(resource) {
      return resource.resourceType.toLowerCase() === "diagnosticreport";
    }
  
    process(diagnosticReport, bundleContext) {
      if (diagnosticReport.media) {
        diagnosticReport.media.forEach(m => {
          var refResource = bundleContext.findReference(
            "Media",
            m.link.reference
          );
          if (refResource) {
            m.link.targetResource = refResource;
            refResource.parentResource = diagnosticReport;
          }
        });
      }
  
      if (diagnosticReport.result) {
        diagnosticReport.result.forEach(obs => {
          var refResource = bundleContext.findReference(
            "Observation",
            obs.reference
          );
          if (refResource) {
            obs.targetResource = refResource;
            refResource.parentResource = diagnosticReport;
          }
        });
      }
  
      if (diagnosticReport.imagingStudy) {
        diagnosticReport.imagingStudy.forEach(imageStudy => {
          var refResource = bundleContext.findReference(
            "ImagingStudy",
            imageStudy.reference
          );
          if (refResource) {
            imageStudy.targetResource = refResource;
            refResource.parentResource = diagnosticReport;
          }
        });
      }
    }
};
  
export class CompositionProcessor extends FhirResourceProcessor {
    supports(resource) {
      return resource.resourceType.toLowerCase() === "composition";
    }
  
    process(composition, bundleContext) {
      if (composition.encounter) {
        var refResource = bundleContext.findReference("Encounter", composition.encounter.reference);
        if (refResource) {
          composition.encounter.targetResource = refResource;
          refResource.parentResource = composition;
        }
      }
      if (composition.section) {
        var unresolvedCompositionSectionEntryRefs = [];
        composition.section.forEach(sec => {
          if (sec.entry) {
            sec.entry.forEach(secEntry => {
              var refResource = bundleContext.findReference(undefined, secEntry.reference);
              if (refResource) {
                secEntry.targetResource = refResource;
                refResource.parentResource = composition;
              } else {
                unresolvedCompositionSectionEntryRefs.push[secEntry.reference];
              }
            });
          };
        });
        if (unresolvedCompositionSectionEntryRefs.length > 0) {
          console.log("there are some unresolved composition sections", unresolvedCompositionSectionEntryRefs);
        }
      }
    }
};